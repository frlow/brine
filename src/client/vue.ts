import { WcWrapperOptions, WcWrapperOptionsMeta } from './index.js'
import { App, createApp, h, reactive } from '@vue/runtime-dom'
import { camelize } from './common.js'

export const createOptions = (
  app: ((props: any) => App) | any,
  meta: WcWrapperOptionsMeta
): WcWrapperOptions => ({
  constructor: (self) => {
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
      (e) => (self.props[`on${camelize(e)}`] = (args: any) => emit(e, args))
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
    ;(self.app as App).unmount()
  },
  style: meta.style,
  tag: meta.tag,
})
