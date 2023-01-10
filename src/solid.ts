import {
  WcWrapperOptionsMeta,
  WcWrapperOptions,
  baseDefine,
  camelize,
} from './core'
import { render, createComponent } from 'solid-js/web'
import { JSX, createRoot, createSignal } from 'solid-js'

export const createOptions = (
  Component: (props: any) => JSX.Element,
  meta: WcWrapperOptionsMeta
): WcWrapperOptions => {
  return {
    init: (self, root, emit) => {
      self.signals = meta.attributes.reduce(
        (acc, cur) => ({ ...acc, [cur]: createSignal() }),
        {}
      )
      meta.emits.forEach((e) => {
        self.signals[camelize(`on-${e}`)] = [
          () => (arg: any) => {
            emit(e, arg)
          },
        ]
      })
    },
    attributes: meta.attributes,
    attributeChangedCallback: (self, root, name, newValue) => {
      self.signals[name][1](newValue)
    },
    connected: (self, root) => {
      self.app = createRoot(() => {
        const props = {}
        Object.entries(self.signals).forEach(([key, value]: any) => {
          Object.defineProperty(props, key, {
            get() {
              return value[0]()
            },
          })
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
  }
}

export const define = (
  Component: (args: any) => JSX.Element,
  meta: WcWrapperOptionsMeta
) => baseDefine(createOptions(Component, meta), meta.tag)
