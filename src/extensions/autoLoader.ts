import type {
  WcWrapper,
  WcWrapperOptions,
  WcWrapperOptionsMeta,
} from '../index.js'
import { createTransplantableWrapper } from './transplant.js'
import { baseDefine } from '../define.js'

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
// export const createAutoLoaderWrapper = (
//   meta: PartialWcWrapperOptionsMeta,
//   loader: () => Promise<WcWrapperOptions>,
//   alt?: PartialWcWrapperOptionsAlt
// ): WcWrapper => {
//   const dummy = {
//     disconnected: () => {},
//     init: () => {},
//     connected: () => {},
//     style: '',
//     attributeChangedCallback: () => {},
//   }
//   const altApplied = alt ? { ...dummy, ...alt } : dummy
//   const options = {
//     ...altApplied,
//     tag: meta.tag,
//     attributes: meta.attributes,
//   }
//   const wrapper = createTransplantableWrapper(options)
//   return class extends wrapper {
//     static loaded = false
//     public static disableLoad = () => {
//       const temp = this.loaded
//       this.loaded = true
//       return temp
//     }
//     public static load = async () => {
//       if (!this.disableLoad()) {
//         const options = await loader()
//         ;(this as any).transplant(options)
//       }
//     }
//
//     initCallback() {
//       super.initCallback()
//       const self: any = this.constructor
//       self.load()
//     }
//   }
// }

export const defineAutoLoader = ({
  tag,
  attributes,
  loader,
  alt,
}: {
  tag: string
  attributes: string[]
  loader: () => void
  alt?: PartialWcWrapperOptionsAlt
}) => {
  const createOptions: () => WcWrapperOptions = () => {
    const loaderOptions = {
      init: () => loader(),
      tag,
      attributes,
      connected: () => {},
      disconnected: () => {},
      style: '',
      attributeChangedCallback: () => {},
    } as any
    return alt
      ? {
          ...loaderOptions,
          ...alt,
          init: (s: any, r: any, e: any) => {
            loaderOptions.init(s, r, e)
            if (alt.init) alt.init(s, r, e)
          },
        }
      : loaderOptions
  }
  baseDefine(
    createOptions,
    undefined as any,
    { tag: tag } as any,
    createTransplantableWrapper
  )
}
