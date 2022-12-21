import path from 'path'
import fs from 'fs'
import { parseFramework, kebabize, analyze, Framework } from './common.js'

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
  emits: ${JSON.stringify(emits)} as string[],
  attributes: ${JSON.stringify(attributes)} as string[],
  style: \`.dummy-style{}\` as string,
  tag: '${tag}' as string,
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
  prefixOrTag: string,
  framework?: Framework,
  fileName?: string
) => {
  const parsedFramework = framework || parseFramework(file)
  const code = await generateMetaFile(file, parsedFramework, prefixOrTag)
  const parsed = path.parse(file)
  const dir = parsed.dir
  const target = path.join(dir, fileName || `${parsed.name}.meta.ts`)
  fs.writeFileSync(target, code, 'utf8')
}
