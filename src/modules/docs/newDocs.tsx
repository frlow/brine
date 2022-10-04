import glob from 'glob'
import { importMdx } from '../../utils/es.cjs'
import path from 'path'
import { kebabize } from '../../utils/kebabize'
import { build, Plugin } from 'esbuild'
import { AnalysisResult } from '../analyze'
import { generateDocsTypesImplementation } from './docsTypes'
import { getFullPath } from '../../utils/pluginUtils'
import { Dictionary } from '../../utils/types'
import { renderToString } from 'react-dom/server'

const internalFilesPlugin = (
  files: { filter: RegExp; content: string }[]
): Plugin => ({
  name: 'internal-files',
  setup(build) {
    for (const file of files) {
      build.onResolve({ filter: file.filter }, async (args) => ({
        path: getFullPath(args),
      }))
      build.onLoad({ filter: file.filter }, async () => ({
        loader: 'tsx',
        contents: file.content,
      }))
    }
  },
})

type ImportDefinition = {
  name: string
  importPath: string
}
const groupLinks = (links: string[]) =>
  links.reduce((acc, cur) => {
    const parts = cur.split('--')
    const key = parts[0]
    if (parts.length === 1) acc[key] = `#${cur}`
    else {
      const obj: Dictionary<string> =
        (acc[key] as Dictionary<string>) || (acc[key] = {})
      obj[parts[1]] = `#${cur}`
    }
    return acc
  }, {} as Dictionary<Dictionary<string> | string>)

export const renderNewDocs = async (
  source: string,
  ar: AnalysisResult[],
  prefix: string,
  dist: string
) => {
  const mdxPlugin = await importMdx()
  const mdxFiles = glob.sync(`${source}/**/*.docs.mdx`).map((f) => ({
    importPath: `./${f}`,
    path: f,
    fullName: path.parse(f).name.replace('.docs', ''),
    name:
      path.parse(f).name.replace('.docs', '').split('--').at(-1)! + 'DocsPage',
  }))
  const imports: ImportDefinition[] = [...mdxFiles]
  const groupedLinks = groupLinks(mdxFiles.map((m) => m.fullName))
  const links = Object.entries(groupedLinks)
    .map(([key, value]) => {
      const name = key.replace('_', '')
      if (typeof value === 'string') {
        return `<li><a href="${value}">${name}</a></li>`
      } else {
        return `<li>${name}</li>
<ul>
${Object.entries(value)
  .map(
    ([linkKey, linkValue]) => `<li><a href="${linkValue}">${linkKey}</a></li>`
  )
  .join('\n')}
</ul>`
      }
    })
    .join('\n')

  const code = `import React from 'react'
${imports.map((i) => `import ${i.name} from '${i.importPath}'`).join('\n')}

export default () => <html lang="en">
  <head>
    <title>Some Title</title>
    <script src='/index.js'></script>
    <link rel="stylesheet" href="/index.css"/>
  </head>
  <body>
    <header>
        <${prefix}-docs-header></${prefix}-docs-header>
    </header>
    <nav>
        <${prefix}-docs-nav links='${JSON.stringify(groupedLinks)}'>
        <ul>
${links}
        </ul>
        </${prefix}-docs-nav>
    </nav>
    <main>
    <${prefix}-docs-main>
${mdxFiles
  .map(
    (m) => `      <div className="docs-page ${kebabize(m.name)}" id="${
      m.fullName
    }">
        <${m.name}/>
      </div>`
  )
  .join('\n')}
    </${prefix}-docs-main>
    </main>
    <footer>
        <${prefix}-docs-footer></${prefix}-docs-footer>
    </footer>
  </body>
</html>
  `
  const example = `import React from 'react'
export const DocsExample = ({children, code, info}:any)=><${prefix}-docs-example info={JSON.stringify(info)} code={JSON.stringify(code)} className="example">
<div className="example">
<div className="example-content">
{children}
</div>
<div className="example-code">
{Object.keys(code).map(key=><div key={key} className={'example-code-'+key}>
<label>{key}</label>
<div >{code[key]}</div>
</div>)}
</div>
</div>
</${prefix}-docs-example>`

  const result = await build({
    entryPoints: ['docsMain.tsx'],
    bundle: true,
    write: false,
    plugins: [
      mdxPlugin(),
      internalFilesPlugin([
        {
          filter: /docsMain\.tsx/,
          content: code,
        },
        {
          filter: /DocsTypes/,
          content: generateDocsTypesImplementation({
            prefix,
            analysisResults: ar,
          }),
        },
        { filter: /DocsExample/, content: example },
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
