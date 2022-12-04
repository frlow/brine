import { Framework } from './index.js'
import path from 'path'
import fs from 'fs'
import { generateMetaCode } from './metaFile.js'
import { parseFramework } from './index.js'

export const generateIndexFile = async (
  file: string,
  framework: Framework,
  prefixOrTag: string
) => {
  const appPath = path.parse(file).base.replace(/\.[j|t]sx?/, '.js')
  const meta = await generateMetaCode(file, framework, prefixOrTag)
  const code = `import { createOptions } from 'brinejs/${framework}'
import App from './${appPath}'

const meta = ${meta}
export const options = createOptions(App, meta)
`
  return code
}

export const writeIndexFile = async (
  file: string,
  prefixOrTag: string,
  framework?: Framework,
  fileName?: string
) => {
  const parsedFramework = framework || parseFramework(file)
  const code = await generateIndexFile(file, parsedFramework, prefixOrTag)
  const dir = path.parse(file).dir
  const target = path.join(dir, fileName || 'index.ts')
  fs.writeFileSync(target, code, 'utf8')
}