import {
  WcWrapper,
  WcWrapperOptions,
  WcWrapperOptionsMeta,
} from '@frlow/brine/client/index'
import { createTransplantableWrapper } from '@frlow/brine/client/extensions/transplant'

export const createAutoLoaderWrapper = (
  meta: WcWrapperOptionsMeta,
  loader: () => Promise<WcWrapperOptions>
): WcWrapper => {
  let loaded = false
  const options: WcWrapperOptions = {
    tag: meta.tag,
    style: '',
    attributes: meta.attributes,
    disconnected: () => {},
    connected: () => {},
    constructor: (self) => {
      if (!loaded) {
        loader().then((options) => {
          console.log('Loading')
          self.constructor?.transplant(options, true)
        })
        loaded = true
      }
    },
    attributeChangedCallback: () => {},
  }
  return createTransplantableWrapper(options)
}
