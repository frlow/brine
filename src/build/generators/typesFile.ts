import fs from 'fs'
import path from 'path'
import {
  parseFramework,
  camelize,
  analyze,
  Framework,
  AnalysisResult,
} from './common.js'
import glob from 'glob'

export const writeAllTypesFiles = async (options: {
  files: string[]
  prefix: string
  version: string
  name: string
  outdir: string
}) => {
  const types = await generateTypes(
    glob.sync('examples/**/*.@(vue|svelte|tsx)'),
    options.prefix
  )
  await writeTypesFile(types, options.outdir)
  await writeVsCodeTypes(types, options.outdir)
  await writeWebTypes(types, options.outdir, {
    name: options.name,
    version: options.version,
  })
  await writeReactWrappersFile(types, options.outdir)
  await writeJSXIntrinsicElementsInterface(types, options.outdir)
}

export const generateTypes = (files: (TypeFile | string)[], prefix?: string) =>
  Promise.all(
    files
      .map(
        (file: any): TypeFile =>
          file.path ? file : { path: file, framework: parseFramework(file) }
      )
      .map((file) =>
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
  dist: string,
  filename?: string
) => {
  if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true })
  fs.writeFileSync(
    path.join(dist, filename || 'types.json'),
    JSON.stringify(results, null, 2)
  )
}

export const writeReactWrappersFile = async (
  results: AnalysisResult[],
  dist: string
) => {
  if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true })
  const code = `import {wrapWc} from 'brinejs/wrapper'
${results
  .map(
    (r) =>
      `export const ${r.name} = wrapWc<{${r.props
        .map((p) => `${camelize(p.name)}${p.optional ? '?' : ''}:${p.type}`)
        .concat(
          r.emits.map(
            (e) => `${camelize(`on-${e.name}`)}:(detail: ${e.type})=>void`
          )
        )
        .join(', ')}}>('${r.tag}', [${r.emits
        .map((e) => `'${e.name}'`)
        .join(', ')}])`
  )
  .join('\n')}`
  fs.writeFileSync(path.join(dist, 'reactWrappers.tsx'), code, 'utf8')
}

export const writeVsCodeTypes = async (
  results: AnalysisResult[],
  dist: string
) => {
  const types = {
    tags: results.map((ar) => ({
      name: ar.tag,
      attributes: ar.props.map((p) => ({ name: p.name })),
    })),
  }
  if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true })
  fs.writeFileSync(
    path.join(dist, 'vscode.html-custom-data.json'),
    JSON.stringify(types, null, 2),
    'utf8'
  )
}

export const writeWebTypes = async (
  results: AnalysisResult[],
  dist: string,
  { name, version }: { name: string; version: string }
) => {
  const webTypes: any = {
    $schema: 'http://json.schemastore.org/web-types',
    'description-markup': 'markdown',
    name,
    version,
    contributions: {
      html: {
        elements: results.map((r) => ({
          name: r.tag,
          js: {
            events: r.emits.map((e) => ({ name: e.name })),
          },
          attributes: r.props.map((p) => ({
            name: p.name,
            description: p.optional ? 'optional' : 'required',
            value: {
              type: p.type,
            },
          })),
        })),
      },
    },
  }
  if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true })
  fs.writeFileSync(
    path.join(dist, 'web-types.json'),
    JSON.stringify(webTypes, null, 2),
    'utf8'
  )
}

export const writeJSXIntrinsicElementsInterface = async (
  results: AnalysisResult[],
  dist: string
) => {
  const getProps = (ar: AnalysisResult) => {
    const props = ar.props.map(
      (p) => `"${p.name}"${p.optional ? '?' : ''}:${p.type}`
    )
    return props.join(', ')
  }
  if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true })
  const code = `export {}
declare global {
  namespace JSX {
    interface IntrinsicElements {
${results.map((r) => `      "${r.tag}":{${getProps(r)}}`).join('\n')}
    }
  }
}
`
  fs.writeFileSync(path.join(dist, 'jsxIntrinsicElements.d.ts'), code, 'utf8')
}
