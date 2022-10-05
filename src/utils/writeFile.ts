import fs from 'fs'
import path from 'path'

export type WriteFileFunc = typeof writeFile

export function writeFile(filePath: string, contents: string | Buffer) {
  const encoding: BufferEncoding =
    typeof contents === 'string' ? 'utf8' : 'binary'
  if (!fs.existsSync(path.dirname(filePath)))
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, contents, encoding)
}
