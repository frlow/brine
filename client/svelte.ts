import { WcWrapperOptions } from './index'

export const svelteCustomElementComponent = (
  component: any,
  attributes: { [i: string]: boolean },
  emits: string[],
  style: string
) =>
  svelteCustomElement(
    (element) =>
      new component({
        target: element,
      }),
    attributes,
    emits,
    style
  )

export const svelteCustomElement = (
  appCreateFunc: (element: HTMLElement) => any,
  attributes: { [i: string]: boolean },
  emits: string[],
  style: string
): WcWrapperOptions => {
  return {
    constructor: (self, emit) => {
      self.state.mountPoint = document.createElement('div')
      self.state.app = appCreateFunc(self.state.mountPoint)
      emits.forEach(
        (e) =>
          (self.state.app.$$.callbacks[e] = [
            (arg: any) => {
              emit(e, arg.detail)
            },
          ])
      )
      self.shadowRoot.appendChild(self.state.mountPoint)
    },
    attributes: Object.keys(attributes),
    attributeChangedCallback: (state, root, name, oldValue, newValue) => {
      state.app.$$set({
        [name]: attributes[name] ? newValue : JSON.parse(newValue),
      })
    },
    connected: (state, root, emit) => {},
    disconnected: (state, root) => {
      state.app.$$.on_disconnect?.forEach((f: any) => f())
      state.app.$$.on_destroy?.forEach((f: any) => f())
    },
    style,
  }
}
