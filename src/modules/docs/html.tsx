import React from 'react'
import { findFiles } from '../../utils/findFiles'
import path from 'path'
import { DocTypePluginOptions, evalMdx } from './mdx'
import fs from 'fs'
import ts, { JsxEmit, ModuleKind } from 'typescript'
import { renderToString } from 'react-dom/server'
import glob from 'glob'

export async function getHtml(
  source: string,
  docTypePluginOptions: Pick<DocTypePluginOptions, 'prefix' | 'analysisResults'>
) {
  const compileNamed = async (
    name: string,
    docTypePluginOptions?: DocTypePluginOptions
  ) => {
    const file = glob.sync(`${source}/**/${name}.tag.@(mdx|tsx)`)[0]
    if (!file) return () => <></>
    else if (file.endsWith('.mdx'))
      return await evalMdx(file, docTypePluginOptions)
    else {
      const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
        compilerOptions: { module: ModuleKind.CommonJS, jsx: JsxEmit.ReactJSX },
      }).outputText
      const Component = eval(code)
      return (args: any) => <Component {...args} />
    }
  }

  const example =
    findFiles(source, (str) => str.endsWith(`Example.tag.tsx`)).map((file) =>
      fs.readFileSync(file, 'utf8')
    )[0] || ''
  const docs = await Promise.all(
    findFiles(source, (str) => str.endsWith('.docs.mdx')).map(async (file) => ({
      name: path.parse(file).name.replace('.docs', ''),
      content: await evalMdx(file, {
        prefix: docTypePluginOptions.prefix,
        analysisResults: docTypePluginOptions.analysisResults,
        example,
      }),
    }))
  )

  const styles = findFiles(source, (str) => str.endsWith('.docs.css')).map(
    (file) => fs.readFileSync(file, 'utf8')
  )
  const Footer = await compileNamed('Footer')
  const Nav = await compileNamed('Nav')
  const Header = await compileNamed('Header')
  const Body = () => {
    return (
      <body>
        <header>
          <Header />
        </header>
        <nav>
          <Nav links={docs.map((d) => d.name)} />
        </nav>
        <main>
          {docs.map((doc, index) => (
            <section key={index} id={doc.name}>
              <doc.content />
            </section>
          ))}
        </main>
        <footer>
          <Footer />
        </footer>
      </body>
    )
  }
  const rendered = renderToString(<Body />)
  const Head = await compileNamed('Head')
  const renderedHead = renderToString(<Head />)
  const html = `<!DOCTYPE html>
<html lang="en" x-data="{ demo: 'someDemo' }">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src='/index.js'></script>
        <script src="//unpkg.com/alpinejs" defer></script>
        <style>${styles.join('\n')}</style>
        <script>
            if(!window.location.hash) window.location.hash="${docs[0].name}"
        </script>
        ${renderedHead}
    </head>
${rendered}
</html>`
  return html
}
