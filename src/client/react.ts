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
      self.app = createRoot(container)
      self.props = {}

      meta.emits.forEach((e) => {
        self.props[`on${camelize(e)}`] = (arg: any) => {
          emit(e, arg)
        }
      })
      self.render = () => {
        self.app.render(createElement(Component, self.props))
      }
    },
    attributes: meta.attributes,
    attributeChangedCallback: (self, name, newValue) => {
      self.props[name] = newValue
      self.render()
    },
    connected: (self, emit) => {
      self.render()
    },
    disconnected: (self) => {
      self.app.unmount()
    },
    style: meta.style,
    tag: meta.tag,
  }
}
export * from './index'
