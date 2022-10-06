import glob from 'glob'
import { importMdx } from '../../utils/es.cjs'
import path from 'path'
import { build, Plugin } from 'esbuild'
import { AnalysisResult } from '../analyze'
import { generateDocsTypesImplementation } from './docsTypes'
import { getFullPath } from '../../utils/pluginUtils'
import { renderToString } from 'react-dom/server'
import { getDocsMain } from './docsMain'
import { getDocsExample } from './docsExample'

const internalFilesPlugin = (
  files: { filter: RegExp; content: string }[]
): Plugin => ({
  name: 'internal-files',
  setup(build) {
    for (const file of files) {
      build.onResolve({ filter: file.filter }, async (args) => ({
        path: getFullPath(args),
      }))
      build.onLoad({ filter: file.filter }, async (args) => ({
        loader: 'tsx',
        contents: file.content,
        resolveDir: path.parse(args.path).dir,
      }))
    }
  },
})

export const renderNewDocs = async (
  source: string,
  ar: AnalysisResult[],
  prefix: string,
  favicon: boolean
) => {
  const mdxPlugin = await importMdx()
  const mdxFiles = glob.sync(`${source}/**/*.docs.mdx`).map((f) => ({
    importPath: `./${f}`,
    path: f,
    fullName: path.parse(f).name.replace('.docs', ''),
    name: (
      path.parse(f).name.replace('.docs', '').split('--').at(-1)! + 'DocsPage'
    ).replace(/[0-9]*_?/g, ''),
  }))

  const result = await build({
    absWorkingDir: path.resolve(source),
    entryPoints: ['docsMain.tsx'],
    bundle: true,
    write: false,
    plugins: [
      mdxPlugin(),
      internalFilesPlugin([
        {
          filter: /docsMain\.tsx/,
          content: getDocsMain(mdxFiles, favicon, prefix),
        },
        {
          filter: /DocsTypes/,
          content: generateDocsTypesImplementation({
            prefix,
            analysisResults: ar,
          }),
        },
        { filter: /DocsExample/, content: getDocsExample(prefix) },
      ]),
    ],
    format: 'cjs',
    outdir: '.',
  }).catch((e) => {
    debugger
    throw e
  })
  const Component = eval(result.outputFiles[0].text).default
  return renderToString(<Component />)
}
