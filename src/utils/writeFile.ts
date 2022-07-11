import fs from 'fs'
import path from 'path'

export type WriteFileFunc = typeof writeFile

export function writeFile(filePath: string, contents: string) {
  if (!fs.existsSync(path.dirname(filePath)))
    fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, contents, 'utf8')
}
