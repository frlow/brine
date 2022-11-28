import { WcWrapperOptions, WcWrapperOptionsMeta } from './index'
import { App, createApp, h, reactive } from 'vue'
import { camelize } from './common'

export const createOptions = (
  app: ((props: any) => App) | any,
  meta: WcWrapperOptionsMeta
): WcWrapperOptions => ({
  constructor: (self) => {
    self.state.props = reactive<any>({})
  },
  attributeChangedCallback: (state, root, name, newValue) => {
    state.props[name] = newValue
  },
  attributes: meta.attributes,
  connected: (state, root, emit) => {
    const mountPoint = document.createElement('div')
    root.appendChild(mountPoint)
    meta.emits.forEach(
      (e) => (state.props[`on${camelize(e)}`] = (args: any) => emit(e, args))
    )
    state.app =
      typeof app === 'function'
        ? app(state.props)
        : createApp({
            render: () => h(app, state.props),
          })
    state.app.mount(mountPoint)
  },
  disconnected: (state) => {
    ;(state.app as App).unmount()
  },
  style: meta.style,
  tag: meta.tag,
})
export * from './index'
