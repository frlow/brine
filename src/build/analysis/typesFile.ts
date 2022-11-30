import { AnalysisResult, Framework } from './common.js'
import { analyze } from './index.js'
import fs from 'fs'
import path from 'path'
import { wrapperCode, wrapperDTs } from './wrapperCode.js'
import { camelize } from '../utils/string.js'
import ts from 'typescript'

export const generateTypes = (files: TypeFile[], prefix?: string) =>
  Promise.all(
    files.map((file) =>
      fs.promises.readFile(file.path, 'utf8').then((f) =>
        analyze(file.path, f, file.framework).then((ar) => {
          if (file.tag) ar.tag = file.tag
          else if (prefix) ar.tag = `${prefix}-${ar.tag}`
          else throw 'prefix or tag must be set'
          return ar
        })
      )
    )
  )

export type TypeFile = { path: string; tag?: string; framework: Framework }
export const writeTypesFile = async (
  results: AnalysisResult[],
  dist: string
) => {
  if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true })
  fs.writeFileSync(
    path.join(dist, 'types.json'),
    JSON.stringify(results, null, 2)
  )
}

export const writeWrappersFile = async (
  results: AnalysisResult[],
  dist: string
) => {
  if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true })
  const code = `${wrapperCode}
${results
  .map(
    (r) =>
      `export const ${r.name} = wrapWc<{${r.props
        .map((p) => `${p.name}${p.optional ? '?' : ''}:${p.type}`)
        .concat(
          r.emits.map(
            (e) => `on${camelize(e.name)}${e.optional ? '?' : ''}:${e.type}`
          )
        )
        .join(', ')}}>('${r.tag}')`
  )
  .join('\n')}`
  const jsx = ts.transpile(code, {
    jsx: ts.JsxEmit.Preserve,
    module: ts.ModuleKind.ES2022,
    target: ts.ScriptTarget.ES2020,
  })
  const dts = wrapperDTs(
    results.map((r) => ({
      name: r.name,
      types: r.props
        .map((p) => `${p.name}${p.optional ? '?' : ''}:${p.type}`)
        .concat(
          r.emits.map(
            (e) => `on${camelize(e.name)}${e.optional ? '?' : ''}:${e.type}`
          )
        )
        .join(', '),
    }))
  )
  fs.writeFileSync(path.join(dist, 'reactWrappers.jsx'), jsx, 'utf8')
  fs.writeFileSync(path.join(dist, 'reactWrappers.d.ts'), dts, 'utf8')
}
