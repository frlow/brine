import { WcWrapperOptions } from './index'
import { App, DefineComponent, createApp, h, reactive } from 'vue'
import { camelize } from '../utils/string'

export const vueCustomElementComponent = (component: DefineComponent) =>
  vueCustomElement(
    (props) =>
      createApp({
        render: () => h(component, props),
      }),
    Object.entries(component.props).reduce((acc, cur: any) => {
      acc[cur[0]] = cur[1]?.type === String
      return acc
    }, {}),
    Array.isArray(component.emits) ? component.emits : []
  )

export const vueCustomElement = (
  appCreateFunc: (props: any) => App,
  attributes: { [i: string]: boolean },
  emits: string[]
): WcWrapperOptions => ({
  constructor: (self) => {
    self.state.props = reactive<any>({})
  },
  attributeChangedCallback: (state, root, name, oldValue, newValue) => {
    state.props[name] = attributes[name] ? newValue : JSON.parse(newValue)
  },
  attributes: Object.keys(attributes || {}),
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
