import esbuild from 'esbuild'
import { AsyncCache } from '../../utils/pluginUtils'
import path from 'path'
import { kebabize } from '../../utils/kebabize'
import { SyntaxKind } from 'typescript'
import { getPropsType } from './reactAnalyzer'
import { PluginOptions } from '../Module'
import { getComponentName } from '../../utils/findFiles'

export const reactElementPlugin = ({
  prefix,
  styles,
}: PluginOptions): esbuild.Plugin => ({
  name: 'brine-react-plugin',
  setup(build) {
    const cache = new AsyncCache()

    build.onLoad(
      {
        filter: /.*/,
        namespace: 'react-entrypoint',
      },
      (args) =>
        cache.get([args.path, args.namespace], async () => {
          const style = styles[path.parse(args.path.split('?')[0]).name] || ''
          const propType = getPropsType(args.path)
          const members = propType?.type?.members?.map((m: any) => ({
            name: m.name.text,
            isFunction: m.type.kind === SyntaxKind.FunctionType,
            isBoolean: m.type.kind === SyntaxKind.BooleanKeyword,
          }))
          const argsCode =
            members
              ?.map(
                (m: any) =>
                  `${m.name}: ${
                    m.isFunction
                      ? `(args) => this.dispatchEvent(new CustomEvent('${prefix}-${kebabize(
                          m.name.replace(/^on/, '')
                        )}', {bubbles: true, detail: [args]}))`
                      : m.isBoolean
                      ? `['true', ''].includes(this.attributes.getNamedItem('${m.name}')?.value)`
                      : `(()=>{const value = this.attributes.getNamedItem('${m.name}')?.value; try{return JSON.parse(value)}catch{return value}})()`
                  }`
              )
              .join(',\n') || ''
          const name = getComponentName(args.path)
          const contents = `import React from 'react'
          import {createRoot} from 'react-dom'
import Component from './${name}'
class ReactWc extends HTMLElement {
  render() {
    const args = {
      ${argsCode}
    } as any
    this.shadowRoot!.innerHTML = ''
    this.root.render(<Component {...args} />)
    const styleElement = document.createElement('style')
    styleElement.innerHTML = \`${style}\`
    this.shadowRoot!.appendChild(styleElement)
  }

  static get observedAttributes() { return [${
    members
      ?.filter((m: any) => !m.isFunction)
      ?.map((m: any) => `"${m.name}"`) || []
  }]; }
  attributeChangedCallback() {
    this.render()
  }
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.root = createRoot(this.shadowRoot)
    this.render()
  }
}

customElements.define('${prefix}-${kebabize(name)}', ReactWc)`
          return {
            loader: 'tsx',
            contents,
            resolveDir: path.dirname(args.path),
          }
        })
    )
  },
})
