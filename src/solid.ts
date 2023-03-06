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

export const define = (
  Component: (args: any) => JSX.Element,
  meta: WcWrapperOptionsMeta
) => baseDefine(createOptions(Component, meta), meta.tag)

export const autoDefine = (options: AutoDefineOptions) => {
  const functionRegex = /^on[A-Z]/
  const props = options.customElementComponent.__props
    .filter((p: string) => !functionRegex.test(p))
    .map((p: string) => kebabize(p))
  baseDefine(
    createOptions(options.customElementComponent.default, {
      emits: [],
      style: options.style,
      tag: options.tag,
      attributes: props,
      shadowRootMode: options.shadowRootMode,
    }),
    options.tag
  )
}
