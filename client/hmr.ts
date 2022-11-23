import { createWrapper, WcWrapperOptions } from '@frlow/brine/client/index'

export const defineHotReloadedComponent = (
  tag: string,
  wrapper: WcWrapperOptions
) => {
  const hmrConnectCallback = (
    args: any,
    connected: (...args: any[]) => void
  ) => {
    debugger
    connected(...args)
  }
  const hmrWrapper = {
    ...wrapper,
    connected: (...args: any) => hmrConnectCallback(args, wrapper.connected),
  }
  if (!customElements.get(tag))
    customElements.define(tag, createWrapper(hmrWrapper))
  else {
    debugger
  }
}
