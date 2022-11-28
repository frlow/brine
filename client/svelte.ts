import { WcWrapperOptions, WcWrapperOptionsMeta } from './index'

export const createOptions = (
  component: any | ((element: HTMLElement) => any),
  meta: WcWrapperOptionsMeta
): WcWrapperOptions => {
  return {
    constructor: (self, emit) => {
      self.state.mountPoint = document.createElement('div')
      self.state.app = component.toString().startsWith('class')
        ? new component({ target: self.state.mountPoint })
        : component(self.state.mountPoint)
      meta.emits.forEach(
        (e) =>
          (self.state.app.$$.callbacks[e] = [
            (arg: any) => {
              emit(e, arg.detail)
            },
          ])
      )
      self.shadowRoot.appendChild(self.state.mountPoint)
    },
    attributes: meta.attributes,
    attributeChangedCallback: (state, root, name, newValue) => {
      state.app.$$set({
        [name]: newValue,
      })
    },
    connected: (state, root, emit) => {},
    disconnected: (state, root) => {
      state.app.$$.on_disconnect?.forEach((f: any) => f())
      state.app.$$.on_destroy?.forEach((f: any) => f())
    },
    style: meta.style,
    tag: meta.tag,
  }
}

export * from './index'
