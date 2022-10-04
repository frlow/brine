import fs, { writeFileSync } from 'fs'
import path from 'path'
import { writeFile } from '../../utils/writeFile'
import { getHtml } from './html'
import { DocTypePluginOptions } from './mdx'
import { renderNewDocs } from './newDocs'
import glob from 'glob'

export { generateDocsTypes } from './docsTypes'

export async function writeDocs(
  source: string,
  dist: string,
  docTypePluginOptions: Pick<DocTypePluginOptions, 'prefix' | 'analysisResults'>
) {
  const html = await renderNewDocs(
    source,
    docTypePluginOptions.analysisResults,
    docTypePluginOptions.prefix,
    dist
  )

  writeFile(path.join(dist, 'docs', 'index.html'), html)
  writeFile(
    path.join(dist, 'docs', 'index.js'),
    fs.readFileSync(path.join(dist, 'bundle', 'index.js'), 'utf8')
  )
  writeFile(
    path.join(dist, 'docs', 'index.js.map'),
    fs.readFileSync(path.join(dist, 'bundle', 'index.js.map'), 'utf8')
  )
  writeFile(
    path.join(dist, 'docs', 'index.css'),
    glob
      .sync(`${source}/**/*.docs.css`)
      .map((f) => fs.readFileSync(f, 'utf8'))
      .join('\n')
  )
}
