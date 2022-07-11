import sveltePreprocess from 'svelte-preprocess'
import { preprocess, compile } from 'svelte/compiler'
import {
  AsyncCache,
  getFullPath,
  getUrlParams,
  toUrl,
} from '../../utils/pluginUtils'
import esbuild from 'esbuild'
import path from 'path'
import fs from 'fs'
import { kebabize } from '../../utils/kebabize'
import { PluginOptions } from '../Module'
import { SyntaxKind } from 'typescript'

export const svelteElementPlugin = ({
  prefix,
  analysisResults,
}: PluginOptions): esbuild.Plugin => ({
  name: 'svelte-plugin',
  setup(build) {
    const cache = new AsyncCache()
    build.onResolve({ filter: /\.svelte/ }, async (args) => {
      const params = getUrlParams(args.path)
      const fullPath = getFullPath(args)
      return {
        path: fullPath,
        namespace:
          params.type === 'style'
            ? 'svelte-style'
            : params.type === 'entry-point'
            ? 'svelte-entrypoint'
            : 'file',
        pluginData: {
          ...args.pluginData,
          index: params.index,
        },
      }
    })

    build.onLoad(
      {
        filter: /.*/,
        namespace: 'svelte-entrypoint',
      },
      (args) =>
        cache.get([args.path, args.namespace], async () => {
          const name = path.parse(args.path).name
          const ar = analysisResults.find((a) => a.name === name)
          if (!ar) throw `Analysis results could not be found for '${name}'`
          const props = ar.props.map((prop) => ({
            name: prop.name,
            bind:
              prop.type.kind === SyntaxKind.StringKeyword
                ? prop.name
                : prop.type.kind === SyntaxKind.BooleanKeyword
                ? `['true', ''].includes(${prop.name})`
                : `(()=>{try{return JSON.parse(${prop.name})}catch{return ${prop.name}}})()`,
          }))
          const slots =
            ar.slots
              ?.map((slot) => `<slot name="${slot}" slot="${slot}"></slot>`)
              .concat('<slot></slot>')
              .join('') || ''
          const demo = `<script>
import Component from './${name}.svelte'
import { createEventDispatcher } from "svelte";
import { get_current_component } from 'svelte/internal';
const component = get_current_component();
const svelteDispatch = createEventDispatcher();
const dispatch = (name, detail) => {
    svelteDispatch(name, detail);
    component.dispatchEvent &&
    component.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
};
${props.map((prop) => `export let ${prop.name}`).join('\n')}
const handleEvent = (ev)=>dispatch('${prefix}-'+ev.type, [ev.detail])
</script>
<svelte:options tag="${prefix}-${kebabize(name)}" />
<Component ${props
            .map((prop) => `${prop.name}={${prop.bind}}`)
            .join(' ')} ${ar.emits
            .map((emit) => `on:${emit.name}={(ev)=>handleEvent(ev)}`)
            .join(' ')}>${slots}</Component>`
          const filename = path.relative(process.cwd(), args.path)
          const processed = await preprocess(demo, [sveltePreprocess()], {
            filename,
          })
          let { js, css, warnings } = compile(processed.code, {
            filename,
            customElement: true,
          })
          return {
            contents: js.code,
            loader: 'js',
            resolveDir: path.dirname(args.path),
          }
        })
    )

    build.onLoad(
      {
        filter: /.*/,
        namespace: 'svelte-style',
      },
      (args) =>
        cache.get([args.path, args.namespace], async () => {
          const params = getUrlParams(args.path)
          const css = Buffer.from(params.content, 'base64').toString()
          return { contents: css, loader: 'css' }
        })
    )

    build.onLoad(
      {
        filter: /\.svelte/,
      },
      (args) =>
        cache.get([args.path, args.namespace], async () => {
          const source = fs.readFileSync(args.path, 'utf8')
          const filename = path.relative(process.cwd(), args.path)
          const name = path.parse(args.path).name
          const processed = await preprocess(source, [sveltePreprocess()], {
            filename,
          })
          let { js, css, warnings } = compile(processed.code, {
            filename,
          })
          const styleEncoded = css.code
            ? Buffer.from(css.code).toString('base64')
            : ''
          let code = `import './${name}.svelte?type=style&content=${styleEncoded}'
          ${js.code}`
          code += `\n//# sourceMappingURL=` + toUrl(js.map.toString())
          return {
            contents: code,
            loader: 'js',
            resolveDir: path.dirname(args.path),
          }
        })
    )
  },
})
