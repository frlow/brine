import React from 'react'
import { findFiles } from '../../utils/findFiles'
import path from 'path'
import { evalMdx, DocTypePluginOptions, compileMdx } from './mdx'
import fs from 'fs'
import { renderToString } from 'react-dom/server'

export async function getHtml(
  source: string,
  docTypePluginOptions: Pick<DocTypePluginOptions, 'prefix' | 'analysisResults'>
) {
  const compileNamed = async (
    name: string,
    docTypePluginOptions?: DocTypePluginOptions
  ) =>
    await evalMdx(
      findFiles(source, (str) => str.endsWith(`${name}.tag.mdx`))[0] || '',
      docTypePluginOptions
    )
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
  const head =
    findFiles(source, (str) => str.endsWith(`Head.tag.html`)).map((file) =>
      fs.readFileSync(file, 'utf8')
    )[0] || ''
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
        ${head}
    </head>
${rendered}
</html>`
  return html
}
