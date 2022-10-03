import glob from 'glob'
import { importMdx } from '../../utils/es.cjs'
import path from 'path'
import { kebabize } from '../../utils/kebabize'
import { Dictionary } from '../../utils/types'

type ImportDefinition = {
  name: string
  importPath: string
}

const groupLinks = (links: string[]) =>
  links.reduce((acc, cur) => {
    const parts = cur.split('--')
    const category = parts.length === 2 ? parts[0] : ''
    const root = parts.length === 1
    const name = parts.length === 2 ? parts[1] : parts[0]
    if (!acc[category]) acc[category] = []
    acc[category].push({ name, link: `#${cur}`, root })
    return acc
  }, {} as { [i: string]: { name: string; link: string; root: boolean }[] })

export const renderNewDocs = async (source: string) => {
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
  const code = `import React from 'react
import { createRoot } from 'react-dom/client' 
${imports.map((i) => `import ${i.name} from '${i.importPath}'`).join('\n')}

const App = <html lang="en">
  <head>
    <title>Some Title</title>
  </head>
  <body>
    <nav>
    </nav>
    <main>
${mdxFiles
  .map(
    (m) => `      <div class="docs-page ${kebabize(m.name)}">
        <${m.name}/>
      </div>`
  )
  .join('\n')}
    </main>
  </body>
</html>

const container = document.getElementById('app')
const root = createRoot(container!)
root.render(<App tab="home" />);
  `
  debugger
}
