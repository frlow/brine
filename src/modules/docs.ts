import fs from 'fs'
import path from 'path'
import { findFiles } from '../utils/findFiles'
import { exampleCode } from './docs/exCode'
import { WriteFileFunc } from '../utils/writeFile'

const body = (source: string) => {
  const custom = findFiles(source, (str) => str.endsWith('.body.html'))
    .map((file) => fs.readFileSync(file, 'utf8'))
    .join('\n')
  return custom || defaultBody
}

const defaultBody = `<div x-text='JSON.stringify(docs)'></div>
`

export function writeDocs(
  source: string,
  name: string,
  prefix: string,
  dist: string,
  writeFile: WriteFileFunc
) {
  const html = getHtml(source, name, prefix, false)
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

export function getHtml(
  source: string,
  name: string,
  prefix: string,
  reload: boolean
) {
  let docs = findFiles(source, (str) => str.endsWith('.docs.html')).map(
    (file) => ({
      name: file,
      content: fs.readFileSync(file, 'utf8'),
    })
  )
  let baseLevel = 0
  while (true) {
    const parts = docs
      .map((doc) => doc.name.split(path.sep)[baseLevel])
      .filter((d) => d)
    if (parts.length === 0 || !parts.every((p) => p === parts[0])) break
    baseLevel++
  }
  const fixedDocs = docs
    .map((doc) => ({
      ...doc,
      position: doc.name
        .split(path.sep)
        .slice(baseLevel)
        .map((p) => p.replace('.docs.html', '')),
    }))
    .sort((a, b) => a.position.join('').localeCompare(b.position.join('')))
  const links = fixedDocs.reduce((acc, doc) => {
    doc.position.forEach((pos, i) => {
      const name = doc.position.slice(0, i + 1).join('/')
      if (name) {
        const current = acc.find((d) => d.name === name)
        if (!current) acc.push({ name, level: i, title: pos.replace('_', '') })
      }
    })
    acc.find((d) => d.name === doc.position.join('/'))!.link =
      '/' + doc.position.join('/')
    return acc
  }, [] as { link?: string; name: string; title: string; level: number }[])

  const html = `<!DOCTYPE html>
<html lang='ts'>
<head>
<title>Component Docs - ${name}</title>
<meta name='viewport' content='width=device-width, initial-scale=1.0'>
<script src='/index.js'></script>
<script>${exampleCode}</script>
<script src='//unpkg.com/alpinejs' defer></script>
${
  reload
    ? '<script>new WebSocket("ws://localhost:3001").addEventListener("message", ()=>window.location.reload())</script>'
    : ''
}
<script>
document.addEventListener('alpine:init', ()=>{
    Alpine.data('docs', () => ({
        docs: ${JSON.stringify(fixedDocs)},
        links: ${JSON.stringify(links)},
        prefix: "${prefix}"
    }))
})
const updateRoute = ()=>{
    document.getElementById("config").dispatchEvent(new CustomEvent("route",{detail: window.location.pathname}))
}
window.ucp = {import: name=>console.log('Importing: '+name)}
window.addEventListener("popstate", ()=>updateRoute())
window.history.pushState = new Proxy(window.history.pushState, {
  apply: (target, thisArg, argArray) => {
    target.apply(thisArg, argArray);
    updateRoute()
  },
});
</script>
</head>
<body x-data='docs' style='margin: 0;'>
<div id='config' 
  x-data='{route:window.location.pathname, framework:localStorage.getItem("framework")||"vue3"}' 
  x-on:route='(r)=>route=r.detail' 
  x-init='$watch("framework", value => localStorage.setItem("framework", value))'
  style="min-height: 100vh;">
${body(source)}
</div>
</body>
</html>`
  return html
}

export const serveDocs = (dist: string) => {
  const liveServer = require('live-server')

  const params = {
    port: 8080,
    host: '0.0.0.0',
    root: `${dist}/docs`,
    open: false,
    file: 'index.html',
    logLevel: 2,
  }
  liveServer.start(params)
}
