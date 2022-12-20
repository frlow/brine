import type { WcWrapperOptions, WcWrapperOptionsMeta } from './index.js'

export const createOptions = (
  component: any | ((element: HTMLElement, props: any) => any),
  meta: WcWrapperOptionsMeta
): WcWrapperOptions => {
  return {
    init: (self) => {
      self.temp = {}
    },
    attributes: meta.attributes,
    attributeChangedCallback: (self, name, newValue) => {
      if (self.app)
        self.app.$$set({
          [name]: newValue,
        })
      else self.temp[name] = newValue
    },
    connected: (self, emit) => {
      self.mountPoint = document.createElement('div')
      self.app = component.toString().startsWith('class')
        ? new component({ target: self.mountPoint, props: self.temp })
        : component(self.mountPoint, self.temp)
      delete self.temp
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
    disconnected: (self) => {
      self.app.$$.on_disconnect?.forEach((f: any) => f())
      self.app.$$.on_destroy?.forEach((f: any) => f())
    },
    style: meta.style,
    tag: meta.tag,
  }
}
