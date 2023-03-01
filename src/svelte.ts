import type {
  AutoDefineOptions,
  WcWrapperOptions,
  WcWrapperOptionsMeta,
} from './common.js'
import { baseDefine } from './define.js'
import { kebabize } from './common.js'

export const createOptions = (
  component: any | ((element: HTMLElement, props: any) => any),
  meta: WcWrapperOptionsMeta
): WcWrapperOptions => {
  return {
    init: (self) => {
      self.temp = {}
    },
    attributes: meta.attributes,
    attributeChangedCallback: (self, root, name, newValue) => {
      if (self.app)
        self.app.$$set({
          [name]: newValue,
        })
      else self.temp[name] = newValue
    },
    connected: (self, root, emit) => {
      self.mountPoint = document.createElement('div')
      self.app = new component({ target: self.mountPoint, props: self.temp })
      delete self.temp
      self.app.$$.callbacks = new Proxy(
        {},
        {
          get(target, prop) {
            return [(arg: any) => emit(prop.toString(), arg.detail)]
          },
        }
      )
      root.appendChild(self.mountPoint)
    },
    disconnected: (self) => {
      self.app.$$.on_disconnect?.forEach((f: any) => f())
      self.app.$$.on_destroy?.forEach((f: any) => f())
      delete self.app
    },
    style: meta.style,
    tag: meta.tag,
    open: meta.open,
  }
}

export const define = (
  component: any | ((element: HTMLElement, props: any) => any),
  meta: WcWrapperOptionsMeta
) => baseDefine(createOptions(component, meta), meta.tag)

export const autoDefine = (options: AutoDefineOptions) => {
  baseDefine(
    createOptions(options.customElementComponent.default, {
      emits: [],
      style: options.style,
      tag: options.tag,
      attributes: options.customElementComponent.__props.map((p: string) =>
        kebabize(p)
      ),
    }),
    options.tag
  )
}
