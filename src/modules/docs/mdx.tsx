import { importMdx } from '../../utils/es.cjs'
import esbuild, { Plugin } from 'esbuild'
import path from 'path'
import { generateDocsTypesImplementation } from './docsTypes'
import { AnalysisResult } from '../analyze'
import { getFullPath } from '../../utils/pluginUtils'

const docsTypeFilter = { filter: /DocsTypes/ }
const docsExampleFilter = { filter: /DocsExampleInternal/ }
export type DocTypePluginOptions = {
  prefix: string
  analysisResults: AnalysisResult[]
  example: string
}
const docsTypesPlugin = (
  docTypePluginOptions: DocTypePluginOptions
): Plugin => ({
  name: 'docs-types-plugin',
  setup(build) {
    build.onResolve(docsTypeFilter, async (args) => ({
      path: getFullPath(args),
    }))
    build.onResolve(docsExampleFilter, async (args) => ({
      path: getFullPath(args),
    }))
    build.onLoad(docsTypeFilter, async (args) => {
      const code = generateDocsTypesImplementation(docTypePluginOptions)
      return {
        contents: code,
        loader: 'tsx',
        resolveDir: path.dirname(args.path),
      }
    })
    build.onLoad(docsExampleFilter, async (args) => {
      const code = docTypePluginOptions.example
      return {
        contents: code,
        loader: 'tsx',
        resolveDir: path.dirname(args.path),
      }
    })
  },
})

export const compileMdx = async (
  file: string,
  docTypePluginOptions?: DocTypePluginOptions,
  format?: 'esm' | 'cjs'
): Promise<string> => {
  const mdx = await importMdx()
  const plugins = [mdx({})]
  if (docTypePluginOptions) plugins.push(docsTypesPlugin(docTypePluginOptions))
  const result = await esbuild.build({
    entryPoints: [file],
    outfile: 'output.js',
    format: format || 'cjs',
    bundle: true,
    plugins,
    write: false,
  })
  return result.outputFiles![0].text
}

export const evalMdx = async (
  file: string,
  docTypePluginOptions?: DocTypePluginOptions
): Promise<(args: any) => JSX.Element> => {
  const code = await compileMdx(file, docTypePluginOptions)
  return eval(code).default
}
