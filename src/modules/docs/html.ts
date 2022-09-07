import { findFiles } from '../../utils/findFiles'
import path from 'path'
import { compileMdx } from './mdx'
import fs from 'fs'

export async function getHtml(source: string) {
  const docs = await Promise.all(
    findFiles(source, (str) => str.endsWith('.mdx')).map(async (file) => ({
      name: path.parse(file).name.replace('.docs', ''),
      content: await compileMdx(file),
    }))
  )
  const styles = findFiles(source, (str) => str.endsWith('.docs.css')).map(
    (file) => fs.readFileSync(file, 'utf8')
  )
  const header =
    findFiles(source, (str) => str.endsWith('header.tag.html')).map((file) =>
      fs.readFileSync(file, 'utf8')
    )[0] || ''
  const footer =
    findFiles(source, (str) => str.endsWith('footer.tag.html')).map((file) =>
      fs.readFileSync(file, 'utf8')
    )[0] || ''
  const nav =
    findFiles(source, (str) => str.endsWith('nav.tag.html')).map((file) =>
      fs.readFileSync(file, 'utf8')
    )[0] || ''
  const html = `<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Docs</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src='/index.js'></script>
        <script src='//unpkg.com/alpinejs' defer></script>
        <style>${styles.join('\n')}</style>
        <script>
            if(!window.location.hash) window.location.hash="${docs[0].name}"
        </script>
    </head>
<body x-data='{links: ${JSON.stringify(docs.map((d) => d.name))}}'>
<header>${header}</header>
<nav>${nav}</nav>
<main>
${docs
  .map((doc) => `<section id="${doc.name}">${doc.content}</section>`)
  .join('\n')}
</main>
<footer>${footer}</footer>
</body>
</html>`
  return html
}
