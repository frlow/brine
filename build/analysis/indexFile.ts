import { Framework } from './common'
import { analyze } from './index'
import path from 'path'
import { kebabize } from '../utils/string'
import fs from 'fs'
import { generateMetaCode } from './metaFile'

export const generateIndexFile = async (
  file: string,
  framework: Framework,
  prefixOrTag: string
) => {
  const appPath = path.parse(file).base.replace(/\.[j|t]sx?/, '.js')
  const meta = await generateMetaCode(file, framework, prefixOrTag)
  const code = `import { createOptions } from '@frlow/brine/client/${framework}'
import App from './${appPath}'

const meta = ${meta}
export const options = createOptions(App, meta)
`
  return code
}

export const writeIndexFile = async (
  file: string,
  framework: Framework,
  prefixOrTag: string,
  fileName?: string
) => {
  const code = await generateIndexFile(file, framework, prefixOrTag)
  const dir = path.parse(file).dir
  const target = path.join(dir, fileName || 'index.ts')
  fs.writeFileSync(target, code, 'utf8')
}
