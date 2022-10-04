import fs from 'fs'
import path from 'path'

export type WriteFileFunc = typeof writeFile

export function writeFile(
  filePath: string,
  contents: any,
  encoding: BufferEncoding = 'utf8'
) {
  if (!fs.existsSync(path.dirname(filePath)))
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, contents, encoding)
}
