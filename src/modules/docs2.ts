// import { compile } from '@mdx-js/mdx'
import fs from 'fs'
import path from 'path'

export const buildDocs = () => {
  const filePath = path.join(process.cwd(), 'example', 'docs', 'Button.mdx')
  const buttonDoc = fs.readFileSync(filePath, 'utf8')
  // const compiled = compile(buttonDoc)
}
