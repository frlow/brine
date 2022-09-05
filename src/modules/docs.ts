import fs from 'fs'
import path from 'path'
import { findFiles } from '../utils/findFiles'
import { WriteFileFunc } from '../utils/writeFile'
import { create } from 'browser-sync'

export function writeDocs(
  source: string,
  dist: string,
  writeFile: WriteFileFunc
) {
  const html = getHtml(source)
  writeFile(path.join(dist, 'docs', 'index.html'), html)
  writeFile(path.join(dist, 'docs', '404.html'), html)
  writeFile(
    path.join(dist, 'docs', 'index.js'),
    fs.readFileSync(path.join(dist, 'bundle', 'index.js'), 'utf8')
  )
  writeFile(
    path.join(dist, 'docs', 'index.js.map'),
    fs.readFileSync(path.join(dist, 'bundle', 'index.js.map'), 'utf8')
  )
}

export function getHtml(source: string) {
  const docs = findFiles(source, (str) => str.endsWith('.docs.html')).map(
    (file) => ({
      name: path.parse(file).name.replace('.docs', ''),
      content: fs.readFileSync(file, 'utf8'),
    })
  )
  const styles = findFiles(source, (str) => str.endsWith('.docs.css')).map(
    (file) => fs.readFileSync(file, 'utf8')
  )
  const example =
    findFiles(source, (str) => str.endsWith('example.tag.html')).map((file) =>
      fs.readFileSync(file, 'utf8')
    )[0] || ''
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

export const serveDocs = (dist: string) => {
  const bs = create()
  bs.init({
    server: `${dist}/docs/`,
    single: true,
    open: false,
  })
  return bs
}
