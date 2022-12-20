import { App, createApp, h, reactive } from '@vue/runtime-dom'
import { camelize } from './utils/kebab.js'
import type { WcWrapperOptions, WcWrapperOptionsMeta } from './index.js'

export const createOptions = (
  app: ((props: any) => App) | any,
  meta: WcWrapperOptionsMeta
): WcWrapperOptions => ({
  init: (self) => {
    self.props = reactive<any>({})
  },
  attributeChangedCallback: (self, name, newValue) => {
    self.props[name] = newValue
  },
  attributes: meta.attributes,
  connected: (self, emit) => {
    const mountPoint = document.createElement('div')
    self.shadowRoot.appendChild(mountPoint)
    meta.emits.forEach(
      (e) => (self.props[camelize(`on-${e}`)] = (args: any) => emit(e, args))
    )
    self.app =
      typeof app === 'function'
        ? app(self.props)
        : createApp({
            render: () => h(app, self.props),
          })
    self.app.mount(mountPoint)
  },
  disconnected: (self) => {
    self.app.unmount()
  },
  style: meta.style,
  tag: meta.tag,
})
