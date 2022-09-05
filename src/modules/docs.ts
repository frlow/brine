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
      name: file,
      content: fs.readFileSync(file, 'utf8'),
      url: file.replace(source, '').replace('.docs.html', ''),
    })
  )
  const styles = findFiles(source, (str) => str.endsWith('.docs.css')).map(
    (file) => ({
      name: file,
      content: fs.readFileSync(file, 'utf8'),
    })
  )
  const html = `<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Docs</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src='/index.js'></script>
        <script src='//unpkg.com/alpinejs' defer></script>
        <style>${styles.map((s) => s.content).join('\n')}</style>
        <script>
        if(!window.location.hash) window.location.hash="${docs[0].url}"
</script>
</head>
<body x-data='{${JSON.stringify(docs)}'>
<main>
${docs
  .map(
    (doc) =>
      `<section id="${doc.name
        .replace(source, '')
        .replace('.docs.html', '')}">${doc.content}</section>`
  )
  .join('\n')}
</main>
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
