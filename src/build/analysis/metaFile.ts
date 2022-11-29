import { analyze } from './index'
import { kebabize } from '../utils/string'
import { Framework } from './common'
import path from 'path'
import fs from 'fs'

export const generateMetaCode = async (
  file: string,
  framework: Framework,
  prefixOrTag: string
) => {
  const code = fs.readFileSync(file, 'utf8')
  const ar = await analyze(file, code, framework)
  const emits = ar.emits.map((e) => e.name)
  const attributes = ar.props.map((p) => p.name)
  const tag = prefixOrTag.includes('-')
    ? prefixOrTag
    : `${prefixOrTag}-${kebabize(ar.name)}`
  const meta = `{
  emits: ${JSON.stringify(emits)},
  attributes: ${JSON.stringify(attributes)},
  style: \`.dummy-style{}\`,
  tag: '${tag}',
}`
  return meta
}

export const generateMetaFile = async (
  file: string,
  framework: Framework,
  prefixOrTag: string
) => {
  const meta = await generateMetaCode(file, framework, prefixOrTag)
  return `export const meta = ${meta}`
}

export const writeMetaFile = async (
  file: string,
  framework: Framework,
  prefixOrTag: string,
  fileName?: string
) => {
  const code = await generateMetaFile(file, framework, prefixOrTag)
  const parsed = path.parse(file)
  const dir = parsed.dir
  const target = path.join(dir, fileName || `${parsed.name}.meta.ts`)
  fs.writeFileSync(target, code, 'utf8')
}
