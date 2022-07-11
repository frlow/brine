import esbuild from 'esbuild'
import { AsyncCache } from '../../utils/pluginUtils'
import { PluginOptions } from '../Module'
import { transformAsync } from '@babel/core'
import path from 'path'
import { kebabize } from '../../utils/kebabize'
import { readFile } from 'fs/promises'
import { getComponentName } from '../../utils/findFiles'
import { SyntaxKind } from 'typescript'

const solid = require('babel-preset-solid')
const ts = require('@babel/preset-typescript')

export const solidElementPlugin = ({
  dist,
  prefix,
  analysisResults,
}: PluginOptions): esbuild.Plugin => ({
  name: 'ucp-solid-plugin',
  setup(build) {
    const cache = new AsyncCache()

    build.onLoad(
      {
        filter: /.*/,
        namespace: 'solid-entrypoint',
      },
      (args) =>
        cache.get([args.path, args.namespace], async () => {
          const componentName = getComponentName(args.path)
          const ar = analysisResults.find((a) => a.name === componentName)
          if (!ar)
            throw `Analysis results could not be found for '${componentName}'`
          const booleanProps = ar.props
            .filter((prop) => prop.type.kind === SyntaxKind.BooleanKeyword)
            .map((p) => p.name)
          const contents = `import { customElement } from 'solid-element';
import { mergeProps, splitProps } from "solid-js";
import Component from './${componentName}.solid'
import style from './${componentName}.solid.style'
customElement('${prefix}-${kebabize(componentName)}', {${ar.props
            .map((p) => `${p.name}:undefined`)
            .join(', ')}}, (props, { element }) => {
            element.attachShadow({ mode: 'open' })
            const styleElement = document.createElement('style')
            styleElement.innerHTML = style
            element.shadowRoot.appendChild(styleElement)
            let mergedEvents = mergeProps({ ${ar.emits
              .map(
                (e) =>
                  `on${e.name.substring(0, 1).toUpperCase()}${e.name.substring(
                    1
                  )}:(ev)=>{
                  element.dispatchEvent(new CustomEvent('${prefix}-${
                    e.name
                  }',{detail:[ev]}))}`
              )
              .join(', ')}}, props);
            const boolsToFix = [${booleanProps
              .map((b) => `"${b}"`)
              .join(',')}].filter(b=>element.attributes[b]?.value==="")
            const [bools, others] = splitProps(mergedEvents, boolsToFix)
            const fixedBools = boolsToFix.reduce((acc,cur)=>({...acc, [cur]: true}),{})
            const merged = mergeProps(others, fixedBools)
            return Component(merged)
          }
          )`
          return { contents, loader: 'js', resolveDir: path.dirname(args.path) }
        })
    )

    build.onLoad({ filter: /\.solid/ }, async (args) => {
      const source = await readFile(args.path, { encoding: 'utf-8' })

      const { name, ext } = path.parse(args.path)
      const filename = name + ext

      const result = await transformAsync(source, {
        presets: [[solid], ts],
        filename,
        sourceMaps: 'inline',
      })
      const contents = result?.code || ''

      return { contents, loader: 'js' }
    })
  },
})
