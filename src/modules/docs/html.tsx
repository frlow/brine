import React from 'react'
import { findFiles } from '../../utils/findFiles'
import path from 'path'
import { compileMdx } from './mdx'
import fs from 'fs'
import { renderToString } from 'react-dom/server'

export async function getHtml(source: string) {
  const compileNamed = async (name: string) =>
    await compileMdx(
      findFiles(source, (str) => str.endsWith(`${name}.tag.mdx`))[0] || ''
    )
  const docs = await Promise.all(
    findFiles(source, (str) => str.endsWith('.docs.mdx')).map(async (file) => ({
      name: path.parse(file).name.replace('.docs', ''),
      content: await compileMdx(file),
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
          {docs.map((doc) => (
            <section key={doc.name} id={doc.name}>
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
  const html = `<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Docs</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src='/index.js'></script>
        <style>${styles.join('\n')}</style>
        <script>
            if(!window.location.hash) window.location.hash="${docs[0].name}"
        </script>
    </head>
${rendered}
</html>`
  return html
}
