import { WcWrapperOptions, WcWrapperOptionsMeta } from './index.js'

export const createOptions = (
  component: any | ((element: HTMLElement) => any),
  meta: WcWrapperOptionsMeta
): WcWrapperOptions => {
  return {
    init: (self, emit) => {
      self.mountPoint = document.createElement('div')
      self.app = component.toString().startsWith('class')
        ? new component({ target: self.mountPoint })
        : component(self.mountPoint)
      meta.emits.forEach(
        (e) =>
          (self.app.$$.callbacks[e] = [
            (arg: any) => {
              emit(e, arg.detail)
            },
          ])
      )
      self.shadowRoot.appendChild(self.mountPoint)
    },
    attributes: meta.attributes,
    attributeChangedCallback: (self, name, newValue) => {
      self.app.$$set({
        [name]: newValue,
      })
    },
    connected: (self, emit) => {},
    disconnected: (self) => {
      self.app.$$.on_disconnect?.forEach((f: any) => f())
      self.app.$$.on_destroy?.forEach((f: any) => f())
    },
    style: meta.style,
    tag: meta.tag,
  }
}
