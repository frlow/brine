import type {
  WcWrapper,
  WcWrapperOptions,
  WcWrapperOptionsMeta,
} from '../index.js'
import { createTransplantableWrapper } from './transplant.js'

export type PartialWcWrapperOptionsMeta = Pick<
  WcWrapperOptionsMeta,
  'tag' | 'attributes'
>
export const createAutoLoaderWrapper = (
  meta: PartialWcWrapperOptionsMeta,
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
        loaded = true
        loader().then((options) => self.constructor?.transplant(options, true))
      }
    },
    attributeChangedCallback: () => {},
  }
  return createTransplantableWrapper(options)
}
