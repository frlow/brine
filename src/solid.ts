import {
  WcWrapperOptionsMeta,
  WcWrapperOptions,
  baseDefine,
  camelize,
  AutoDefineOptions,
  kebabize,
} from './core'
import { render, createComponent } from 'solid-js/web'
import { JSX, createRoot, createSignal } from 'solid-js'

export const createOptions = (
  Component: (props: any) => JSX.Element,
  meta: WcWrapperOptionsMeta
): WcWrapperOptions => {
  return {
    init: (self) => {
      self.signals = meta.attributes.reduce(
        (acc, cur) => ({ ...acc, [cur]: createSignal() }),
        {}
      )
    },
    attributes: meta.attributes,
    attributeChangedCallback: (self, root, name, newValue) => {
      self.signals[name][1](newValue)
    },
    connected: (self, root, emit) => {
      self.app = createRoot(() => {
        const props = new Proxy(self.signals, {
          get(target, prop: string) {
            const regex = /on[A-Z]/
            if (regex.test(prop))
              return (detail: any) => emit(kebabize(prop.substring(2)), detail)
            return target[prop][0]()
          },
        })
        return createComponent(Component, props)
      })
      render(() => self.app, root)
    },
    disconnected: (self) => {
      self.innerHTML = ''
    },
    style: meta.style,
    tag: meta.tag,
    shadowRootMode: meta.shadowRootMode,
  }
}

export const define = (options: AutoDefineOptions) => {
  baseDefine(
    createOptions(options.customElementComponent.default, {
      emits: options.customElementComponent.__emits || [],
      style: options.style,
      tag: options.tag,
      attributes: options.customElementComponent.__props || [],
      shadowRootMode: options.shadowRootMode,
    })
  )
}
