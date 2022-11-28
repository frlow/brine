import { Framework } from './common'
import { analyze } from './index'
import path from 'path'
import { kebabize } from '../utils/string'
import fs from 'fs'

export const generateIndexFile = async (
  file: string,
  framework: Framework,
  prefixOrTag: string
) => {
  const ar = await analyze(file, framework)
  const appPath = path.parse(file).base.replace(/\.[j|t]sx?/, '.js')
  const emits = ar.emits.map((e) => e.name)
  const attributes = ar.props.map((p) => p.name)
  const tag = prefixOrTag.includes('-')
    ? prefixOrTag
    : `${prefixOrTag}-${kebabize(ar.name)}`
  const code = `import { createOptions } from '@frlow/brine/client/${framework}'
import App from './${appPath}'

const meta = {
  emits: ${JSON.stringify(emits)},
  attributes: ${JSON.stringify(attributes)},
  style: \`.dummy-style{}\`,
  tag: '${tag}',
}
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
