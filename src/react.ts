import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { WcWrapperOptions, WcWrapperOptionsMeta, camelize } from './common.js'
import { baseDefine } from './define.js'

export const createOptions = (
  Component: (args: any) => JSX.Element,
  meta: WcWrapperOptionsMeta
): WcWrapperOptions => {
  return {
    init: (self, root, emit) => {
      const container = document.createElement('div')
      root.appendChild(container)
      self.app = createRoot(container)
      self.props = {}

      meta.emits.forEach((e) => {
        self.props[camelize(`on-${e}`)] = (arg: any) => {
          emit(e, arg)
        }
      })
      self.render = () => {
        self.app.render(createElement(Component, self.props))
      }
    },
    attributes: meta.attributes,
    attributeChangedCallback: (self, root, name, newValue) => {
      self.props[name] = newValue
      self.render()
    },
    connected: (self) => {
      self.render()
    },
    disconnected: (self) => {
      self.app.unmount()
      delete self.app
    },
    style: meta.style,
    tag: meta.tag,
  }
}

export const define = (
  Component: (args: any) => JSX.Element,
  meta: WcWrapperOptionsMeta
) => baseDefine(createOptions(Component, meta), meta.tag)
