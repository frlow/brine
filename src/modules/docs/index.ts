import fs from 'fs'
import path from 'path'
import { writeFile } from '../../utils/writeFile'
import { create } from 'browser-sync'
import { getHtml } from './html'

export { generateDocsTypes } from './docsTypes'

export async function writeDocs(source: string, dist: string) {
  const html = await getHtml(source)
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

export const serveDocs = (dist: string) => {
  const bs = create()
  bs.init({
    server: `${dist}/docs/`,
    single: true,
    open: false,
  })
  return bs
}
