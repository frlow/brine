import { createWrapper, WcWrapperOptions } from './index'

const w = window as undefined as {
  hmr: {
    elements: {
      tag: string
      element: any
      transplant: (opts: WcWrapperOptions) => void
    }[]
    reload: (tag: string, wrapper: WcWrapperOptions) => void
  }
}
const initHmr = () => {
  if (!w.hmr) {
    w.hmr = {
      elements: [],
      reload: (tag, wrapper) => {
        const elements = w.hmr.elements.filter((el) => el.tag === tag)
        elements.forEach((el) => {
          el.transplant(wrapper)
        })
      },
    }
    const ws = new WebSocket('ws://localhost:8080')
    ws.onmessage = (ev) => {
      const data = JSON.parse(ev.data)
      if (data.action === 'update') {
        data.files.forEach((file: string) => {
          import(`${file}?timestamp=${Date.now()}`)
        })
      }
    }
  }
}

export const defineHotReloadedComponent = (
  tag: string,
  wrapper: WcWrapperOptions
) => {
  initHmr()
  const hmrConstructor = (args: any, constructor: (...args: any[]) => void) => {
    w.hmr.elements.push({ tag, element: args[1].host, transplant: args[2] })
    constructor(...args)
  }
  const hmrDisconnect = (args: any, disconnected: (...args: any[]) => void) => {
    const hmrEl = w.hmr.elements.find((el) => el.element === args[1].host)
    w.hmr.elements.splice(w.hmr.elements.indexOf(hmrEl), 1)
    disconnected(...args)
  }
  const hmrWrapper = {
    ...wrapper,
    constructor: (...args: any) => hmrConstructor(args, wrapper.constructor),
    disconnected: (...args: any) => hmrDisconnect(args, wrapper.disconnected),
  }
  if (!customElements.get(tag))
    customElements.define(tag, createWrapper(hmrWrapper))
  else {
    w.hmr.reload(tag, hmrWrapper)
  }
}
