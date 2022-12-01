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
export type PartialWcWrapperOptionsAlt = Partial<
  Pick<
    WcWrapperOptions,
    'init' | 'connected' | 'attributeChangedCallback' | 'disconnected' | 'style'
  >
>
export const createAutoLoaderWrapper = (
  meta: PartialWcWrapperOptionsMeta,
  loader: () => Promise<WcWrapperOptions>,
  alt?: PartialWcWrapperOptionsAlt
): WcWrapper => {
  let loaded = false
  const dummy = {
    disconnected: () => {},
    init: () => {},
    connected: () => {},
    style: '',
    attributeChangedCallback: () => {},
  }
  const altApplied = alt ? { ...dummy, ...alt } : dummy
  const options = {
    ...altApplied,
    init: (self: any, emit: any) => {
      altApplied.init(self, emit)
      if (!loaded) {
        loaded = true
        loader().then((options) => self.constructor?.transplant(options, true))
      }
    },
    tag: meta.tag,
    attributes: meta.attributes,
  }
  return createTransplantableWrapper(options)
}
