import { WcWrapperOptions } from './index'
import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { camelize } from './common'

export const reactCustomElementComponent = (
  Component: (args: any) => JSX.Element,
  attributes: { [i: string]: boolean },
  emits: string[],
  style: string
): WcWrapperOptions => {
  return {
    constructor: (self, emit) => {
      self.state.props = {}
      emits.forEach((e) => {
        self.state.props[`on${camelize(e)}`] = (arg: any) => {
          emit(e, arg)
        }
      })
      self.state.render = () => {
        if (self.state.app)
          self.state.app.render(createElement(Component, self.state.props))
      }
    },
    attributes: Object.keys(attributes || {}),
    attributeChangedCallback: (state, root, name, oldValue, newValue) => {
      state.props[name] = attributes[name] ? newValue : JSON.parse(newValue)
      state.render()
    },
    connected: (state, root, emit) => {
      const container = document.createElement('div')
      root.appendChild(container)
      state.app = createRoot(container)
      state.render()
    },
    disconnected: (state) => {
      state.app.unmount()
    },
    style,
  }
}
