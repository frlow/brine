import { getNav } from './docsNav'
import { kebabize } from '../../utils/kebabize'

type ImportDefinition = {
  name: string
  fullName: string
  importPath: string
}

export const getDocsMain = (
  imports: ImportDefinition[],
  favicon: boolean,
  prefix: string
) => {
  const docsMain = `import React from 'react'
${imports.map((i) => `import ${i.name} from '${i.importPath}'`).join('\n')}

export default () => <html lang="en">
  <head>
    <title>Brine Component Library</title>
    ${
      favicon ? '<link rel="icon" type="image/x-icon" href="favicon.ico"/>' : ''
    }
    <script src='/index.js'></script>
    <link rel="stylesheet" href="/index.css"/>
  </head>
  <body>
    <header>
        <${prefix}-docs-header></${prefix}-docs-header>
    </header>
    ${getNav(
      prefix,
      imports.map((m) => m.fullName)
    )}
    <main>
    <${prefix}-docs-main>
${imports
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
  return docsMain
}
