import { WcWrapperOptions, WcWrapperOptionsMeta } from './index'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { camelize } from './common'

export const createOptions = (
  Component: (args: any) => JSX.Element,
  meta: WcWrapperOptionsMeta
): WcWrapperOptions => {
  return {
    constructor: (self, emit) => {
      const container = document.createElement('div')
      self.shadowRoot.appendChild(container)
      self.state.app = createRoot(container)
      self.state.props = {}

      meta.emits.forEach((e) => {
        self.state.props[`on${camelize(e)}`] = (arg: any) => {
          emit(e, arg)
        }
      })
      self.state.render = () => {
        self.state.app.render(createElement(Component, self.state.props))
      }
    },
    attributes: Object.keys(meta.attributes || {}),
    attributeChangedCallback: (state, root, name, oldValue, newValue) => {
      state.props[name] = meta.attributes[name]
        ? newValue
        : JSON.parse(newValue)
      state.render()
    },
    connected: (state, root, emit) => {
      state.render()
    },
    disconnected: (state) => {
      state.app.unmount()
    },
    style: meta.style,
    tag: meta.tag,
  }
}
export * from './index'
