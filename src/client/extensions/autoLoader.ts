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
    tag: meta.tag,
    attributes: meta.attributes,
  }
  const wrapper = createTransplantableWrapper(options)
  return class extends wrapper {
    static loaded = false
    public static disableLoad = () => {
      const temp = this.loaded
      this.loaded = true
      return temp
    }
    public static load = async () => {
      if (!this.disableLoad()) {
        const options = await loader()
        ;(this as any).transplant(options, true)
      }
    }

    init() {
      super.init()
      const self: any = this.constructor
      self.load()
    }
  }
}
