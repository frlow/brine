import { WcWrapper, WcWrapperOptions } from '@frlow/brine/client/index'

const w = window as any

export const initHmr = (
  wrappers: WcWrapper[],
  options: { host?: string; force?: boolean } = {}
) => {
  const isInit = w.hmr
  if (!isInit) {
    w.hmr = {}
    w.hmr.wrappers = []
  }
  w.hmr.wrappers.push(...wrappers)
  if (!isInit) {
    const ws = new WebSocket(options.host || 'ws://localhost:8080')
    ws.onmessage = async (msg) => {
      console.log(msg)
      // const obj = options.force
      //   ? await import(`${msg.data}?timstamp=${Date.now()}`)
      //   : await import(msg.data)
      // if (obj.options) {
      //   const options = obj.options as WcWrapperOptions
      //   const wrapper = w.hmr.wrappers.find(
      //     (wr: WcWrapper) => wr.options.tag === options.tag
      //   )
      //   if (wrapper?.transplant) wrapper.transplant(options)
      // }
    }
  }
}
