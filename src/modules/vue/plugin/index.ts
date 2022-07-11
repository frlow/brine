import * as esbuild from 'esbuild'
import * as path from 'path'
import * as fs from 'fs'
import * as crypto from 'crypto'

import * as sfc from 'vue/compiler-sfc'

import { replaceRules } from './paths'
import { Options } from './options'
import randomBytes from './random'
import { kebabize } from '../../../utils/kebabize'
import {
  AsyncCache,
  getFullPath,
  getUrlParams,
  tryAsync,
} from '../../../utils/pluginUtils'
import { PluginOptions } from '../../Module'

type PluginData = {
  descriptor: sfc.SFCDescriptor
  id: string
  script?: sfc.SFCScriptBlock
}

const vuePlugin = (
  opts: Options = {},
  { prefix, analysisResults }: PluginOptions
) =>
  <esbuild.Plugin>{
    name: 'vue',
    async setup({ initialOptions: buildOpts, ...build }) {
      buildOpts.define = {
        ...buildOpts.define,
        __VUE_OPTIONS_API__: opts.disableOptionsApi ? 'false' : 'true',
        __VUE_PROD_DEVTOOLS__: opts.enableDevTools ? 'true' : 'false',
      }

      const random = randomBytes(
        typeof opts.scopeId === 'object' &&
          typeof opts.scopeId.random === 'string'
          ? opts.scopeId.random
          : undefined
      )

      const getId = (filename: string) =>
        !opts.scopeId || opts.scopeId === 'hash'
          ? crypto
              .createHash('md5')
              .update(filename)
              .digest()
              .toString('hex')
              .substring(0, 8)
          : random(4).toString('hex')

      const cache = new AsyncCache(!opts.disableCache)

      // Resolve main ".vue" import
      build.onResolve({ filter: /\.vue/ }, async (args) => {
        const params = getUrlParams(args.path)
        const fullPath = getFullPath(args)
        return {
          path: fullPath,
          namespace:
            params.type === 'script'
              ? 'sfc-script'
              : params.type === 'template'
              ? 'sfc-template'
              : params.type === 'style'
              ? 'sfc-style'
              : params.type === 'element'
              ? 'sfc-element'
              : params.type === 'entry-point'
              ? 'sfc-entrypoint'
              : 'file',
          pluginData: {
            ...args.pluginData,
            index: params.index,
          },
        }
      })

      // Load stub when .vue is requested
      build.onLoad({ filter: /.*/, namespace: 'sfc-entrypoint' }, (args) =>
        cache.get([args.path, args.namespace], async () => {
          const fileName = path.parse(args.path).name
          const ar = analysisResults.find((a) => a.name === fileName)
          if (!ar) throw `Analysis results could not be found for '${fileName}'`
          const contents = `import {defineCustomElement} from 'vue'
import Component from './${fileName}.vue'
import style from './${fileName}.style'
const Element = defineCustomElement(Component);
class StyledElement extends Element {
  constructor(args) {
    super(args)
    const styleElement = document.createElement('style')
    styleElement.innerHTML = style
    this.shadowRoot.appendChild(styleElement)
    ${ar.emits
      .map(
        (emit) => `this.addEventListener('${emit.name}',(ev)=>{
              if(ev[Symbol.toStringTag] === "CustomEvent")
                this.dispatchEvent(new CustomEvent('${prefix}-${emit.name}', { detail: ev.detail }))
        })`
      )
      .join('\n')}
  }
}
customElements.define("${prefix}-${kebabize(fileName)}", StyledElement);`
          return {
            loader: 'js',
            contents,
            resolveDir: path.dirname(args.path),
          }
        })
      )

      build.onLoad({ filter: /.*/, namespace: 'sfc-script' }, (args) =>
        cache.get([args.path, args.namespace], async () => {
          const { script } = args.pluginData as PluginData

          if (script) {
            let code = script.content

            if (buildOpts.sourcemap && script.map) {
              const sourceMap = Buffer.from(
                JSON.stringify(script.map)
              ).toString('base64')

              code +=
                '\n\n//@ sourceMappingURL=data:application/json;charset=utf-8;base64,' +
                sourceMap
            }

            return {
              contents: code,
              loader: script.lang === 'ts' ? 'ts' : 'js',
              resolveDir: path.dirname(args.path),
            }
          }
        })
      )

      build.onLoad(
        {
          filter: /.*/,
          namespace: 'sfc-template',
        },
        (args) =>
          cache.get([args.path, args.namespace], async () => {
            const { descriptor, id, script } = args.pluginData as PluginData
            if (!descriptor.template) {
              throw new Error('Missing template')
            }

            let source = descriptor.template.content

            if (descriptor.template.lang === 'pug') {
              const pug = await tryAsync(
                () => import('pug'),
                'pug',
                'Pug template rendering'
              )
              source = pug.render(descriptor.template.content)

              // Fix #default="#default" and v-else="v-else"
              source = source.replace(/(\B#.*?|\bv-.*?)="\1"/g, '$1')
            }

            const result = sfc.compileTemplate({
              id,
              source,
              filename: args.path,
              scoped: descriptor.styles.some((o) => o.scoped),
              slotted: descriptor.slotted,
              ssr: opts.renderSSR,
              ssrCssVars: [],
              isProd: process.env.NODE_ENV === 'production' || buildOpts.minify,
              compilerOptions: {
                inSSR: opts.renderSSR,
                bindingMetadata: script?.bindings,
              },
            })

            if (result.errors.length > 0) {
              return {
                errors: result.errors.map<esbuild.PartialMessage>((o) =>
                  typeof o === 'string'
                    ? { text: o }
                    : {
                        text: o.message,
                        location: o.loc && {
                          column: o.loc.start.column,
                          file: descriptor.filename,
                          line:
                            o.loc.start.line +
                            descriptor.template!.loc.start.line +
                            1,
                          lineText: o.loc.source,
                        },
                      }
                ),
              }
            }

            return {
              contents: result.code,
              warnings: result.tips.map((o) => ({ text: o })),
              loader: 'js',
              resolveDir: path.dirname(args.path),
            }
          })
      )

      build.onLoad({ filter: /.*/, namespace: 'sfc-style' }, (args) =>
        cache.get([args.path, args.namespace], async () => {
          const { descriptor, index, id } = args.pluginData as PluginData & {
            index: number
          }

          const style: import('@vue/compiler-sfc').SFCStyleBlock =
            descriptor.styles[index]
          let includedFiles: string[] = []

          const result = await sfc.compileStyleAsync({
            filename: args.path,
            id,
            source: style.content,
            postcssOptions: opts.postcss?.options,
            postcssPlugins: opts.postcss?.plugins,
            preprocessLang: style.lang as any,
            preprocessOptions: {
              includePaths: [path.dirname(args.path)],
              importer: [
                (url: string) => {
                  const modulePath = path.join(
                    process.cwd(),
                    'node_modules',
                    url
                  )

                  if (fs.existsSync(modulePath)) {
                    return { file: modulePath }
                  }

                  return null
                },
                (url: string) => ({ file: replaceRules(url) }),
              ],
            },
            scoped: style.scoped,
          })

          if (result.errors.length > 0) {
            const errors = result.errors as (Error & {
              column: number
              line: number
              file: string
            })[]

            return {
              errors: errors.map((o) => ({
                text: o.message,
                location: {
                  column: o.column,
                  line:
                    o.file === args.path
                      ? style.loc.start.line + o.line - 1
                      : o.line,
                  file: o.file.replace(/\?.*?$/, ''),
                  namespace: 'file',
                },
              })),
            }
          }

          return {
            contents: result.code,
            loader: 'css',
            resolveDir: path.dirname(args.path),
            watchFiles: includedFiles,
          }
        })
      )

      build.onLoad({ filter: /runtime-dom.esm-bundler.js/ }, (args) => {
        const code = fs.readFileSync(args.path, 'utf8')
        const patchedCode = code
          .replace(
            'ensureRenderer().render(...args);',
            'ensureRenderer().render({...args[0], props: !(args[0] && args[0].props) ? {} : Object.entries(args[0].props).filter(d=>!d[0].startsWith("@")).reduce((acc,[key, value]) => ({...acc,[key]:(()=>{try{return JSON.parse(value)}catch{return value}})()}),{})}, args[1])'
          )
          .replace(
            'const opt = props[key];',
            'const opt = props ? props[key] : undefined;'
          )
        return { loader: 'js', contents: patchedCode }
      })

      build.onLoad({ filter: /\.vue$/ }, (args) =>
        cache.get([args.path, args.namespace], async () => {
          const encPath = args.path.replace(/\\/g, '\\\\')

          const source = await fs.promises.readFile(args.path, 'utf8')
          const filename = path.relative(process.cwd(), args.path)

          const id = getId(filename)

          const { descriptor } = sfc.parse(source, {
            filename,
          })
          const script =
            descriptor.script || descriptor.scriptSetup
              ? sfc.compileScript(descriptor, { id })
              : undefined

          const dataId = 'data-v-' + id
          let code = ''

          if (descriptor.script || descriptor.scriptSetup) {
            code += `import script from "${encPath}?type=script";`
          } else {
            code += 'const script = {};'
          }

          for (const style in descriptor.styles) {
            code += `import "${encPath}?type=style&index=${style}";`
          }

          const renderFuncName = opts.renderSSR ? 'ssrRender' : 'render'

          code += `import { ${renderFuncName} } from "${encPath}?type=template"; script.${renderFuncName} = ${renderFuncName};`

          code += `script.__file = ${JSON.stringify(filename)};`
          if (descriptor.styles.some((o) => o.scoped)) {
            code += `script.__scopeId = ${JSON.stringify(dataId)};`
          }
          if (opts.renderSSR) {
            code += 'script.__ssrInlineRender = true;'
          }

          code += 'export default script;'

          return {
            contents: code,
            resolveDir: path.dirname(args.path),
            pluginData: { descriptor, id: dataId, script } as PluginData,
            watchFiles: [args.path],
          }
        })
      )
    },
  }

export = vuePlugin
