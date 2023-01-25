// import type { WcWrapperOptions } from './common.js'
// import { makeWrapperTransplantable } from './transplant.js'
// import { baseDefine } from './define.js'
//
// export type PartialWcWrapperOptionsAlt = Partial<
//   Pick<
//     WcWrapperOptions,
//     'init' | 'connected' | 'attributeChangedCallback' | 'disconnected' | 'style'
//   >
// >
//
// export const defineAutoLoader = ({
//   liteMeta,
//   loader,
//   alt,
// }: {
//   liteMeta: {
//     tag: string
//     attributes: string[]
//   }
//   loader: () => void
//   alt?: PartialWcWrapperOptionsAlt
// }) => {
//   const loaderOptions = {
//     init: () => loader(),
//     tag: liteMeta.tag,
//     attributes: liteMeta.attributes,
//     connected: () => {},
//     disconnected: () => {},
//     style: '',
//     attributeChangedCallback: () => {},
//   } as any
//   const options = alt
//     ? {
//         ...loaderOptions,
//         ...alt,
//         init: (s: any, r: any, e: any) => {
//           loaderOptions.init(s, r, e)
//           if (alt.init) alt.init(s, r, e)
//         },
//       }
//     : loaderOptions
//   baseDefine(options, liteMeta.tag, makeWrapperTransplantable)
// }
