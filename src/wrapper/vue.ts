import { WcWrapperOptions } from './index'
import { App, DefineComponent, createApp, h, reactive } from 'vue'
import { camelize } from './common'

export const vueCustomElementComponent = (component: DefineComponent) =>
  vueCustomElement(
    (props) =>
      createApp({
        render: () => h(component, props),
      }),
    component.props,
    Array.isArray(component.emits) ? component.emits : []
  )

export const vueCustomElement = (
  appCreateFunc: (props: any) => App,
  props: any,
  emits: string[]
): WcWrapperOptions => ({
  constructor: (self) => {
    self.state.props = reactive<any>({})
  },
  attributeChangedCallback: (state, root, name, oldValue, newValue) => {
    const prop = props[name]
    const isString = prop?.type === String
    state.props[name] = isString ? newValue : JSON.parse(newValue)
  },
  attributes: Object.keys(props || {}),
  connected: (state, root, emit) => {
    const mountPoint = document.createElement('div')
    root.appendChild(mountPoint)
    emits.forEach(
      (e) => (state.props[`on${camelize(e)}`] = (args: any) => emit(e, args))
    )
    state.app = appCreateFunc(state.props)
    state.app.mount(mountPoint)
  },
  disconnected: (state) => {
    ;(state.app as App).unmount()
  },
})
