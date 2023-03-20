import {
  WcWrapperOptionsMeta,
  WcWrapperOptions,
  baseDefine,
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
      const app = createRoot((dispose) => {
        self.dispose = dispose
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
      render(() => app, root)
    },
    disconnected: (self) => {
      self.dispose()
      self.innerHTML = ''
    },
    style: meta.style,
    tag: meta.tag,
    shadowRootMode: meta.shadowRootMode,
  }
}

type SolidDefineProps =
  | 'customElementComponent'
  | 'tag'
  | 'style'
  | 'shadowRootMode'
  | 'attributes'
export const define = (
  options: Pick<
    AutoDefineOptions<((props: any) => JSX.Element) & { __props?: string[] }>,
    SolidDefineProps
  >
) => {
  baseDefine(
    createOptions(options.customElementComponent, {
      style: options.style,
      tag: options.tag,
      attributes:
        options.customElementComponent.__props || options.attributes || [],
      shadowRootMode: options.shadowRootMode,
    })
  )
}
