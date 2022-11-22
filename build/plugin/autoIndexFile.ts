import type { Plugin } from 'esbuild'
import path from 'path'
import fs from 'fs'
import { kebabize } from '../utils/string'
import { analyze } from '../analysis'

function escapeRegex(string: string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')
}

function isString(type: string) {}

export const getEnding = (ext: string) => {
  switch (ext) {
    case '.svelte':
      return '.svelte'
    case '.vue':
      return '.vue'
    default:
      return ''
  }
}

export const generateIndexFile = async (
  file: AutoIndexFilePluginOptions,
  prefix: string
) => {
  const parsed = path.parse(file.path)
  const result = await analyze(file.path, file.framework)
  const attributes = result.props.reduce((acc, cur) => {
    acc[cur.name] = cur.type === 'string'
    return acc
  }, {} as { [i: string]: boolean })
  const emits = result.emits.map((e) => kebabize(e.name))
  const code = `import App from './${parsed.name}${getEnding(parsed.ext)}'
import { ${file.framework}CustomElementComponent } from '@frlow/brine/client/${
    file.framework
  }'
import { createWrapper } from '@frlow/brine/client/index'
const wrapper = ${file.framework}CustomElementComponent(App,${JSON.stringify(
    attributes
  )},${JSON.stringify(emits)})
customElements.define('${prefix}-${kebabize(
    parsed.name
  )}', createWrapper(wrapper, \`.dummy-style{}\`))
`
  return code
}

export const writeAutoIndexFiles = async (
  files: AutoIndexFilePluginOptions[],
  prefix: string
) => {
  for (const file of files) {
    const code = await generateIndexFile(file, prefix)
    const parsed = path.parse(file.path)
    fs.writeFileSync(
      path.join(parsed.dir, `${file.name || 'index'}.ts`),
      code,
      'utf8'
    )
  }
}

export type Framework = 'react' | 'vue' | 'svelte'
export type AutoIndexFilePluginOptions = {
  path: string
  framework: Framework
  name?: string
}
export const autoIndexFilePlugin = (
  files: AutoIndexFilePluginOptions[],
  prefix: string
): Plugin => ({
  name: 'auto-index-file',
  setup(build) {
    for (const file of files) {
      const indexPath = path.join(
        path.parse(file.path).dir,
        `${file.name || 'index'}.ts`
      )
      const filter = new RegExp(escapeRegex(indexPath))
      build.onResolve({ filter }, async (args) => {
        return {
          path: path.join(args.resolveDir, args.path),
        }
      })
      build.onLoad({ filter }, async (args) => {
        return {
          contents: await generateIndexFile(file, prefix),
          resolveDir: path.parse(args.path).dir,
          loader: 'ts',
        }
      })
    }
  },
})
