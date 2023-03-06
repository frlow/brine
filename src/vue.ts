import { App, createApp, h, reactive } from '@vue/runtime-dom'
import {
  WcWrapperOptions,
  WcWrapperOptionsMeta,
  camelize,
  AutoDefineOptions,
} from './common.js'
import { baseDefine } from './define.js'

export const createOptions = (
  meta: WcWrapperOptionsMeta,
  createCustom: (props: any) => App
): WcWrapperOptions => ({
  init: (self) => {
    self.props = reactive<any>({})
  },
  attributeChangedCallback: (self, root, name, newValue) => {
    self.props[name] = newValue
  },
  attributes: meta.attributes,
  connected: (self, root, emit) => {
    const mountPoint = document.createElement('div')
    root.appendChild(mountPoint)
    meta.emits?.forEach(
      (e) => (self.props[camelize(`on-${e}`)] = (args: any) => emit(e, args))
    )
    self.app = createCustom(self.props)
    self.app.mount(mountPoint)
  },
  disconnected: (self) => {
    self.app.unmount()
    delete self.app
  },
  style: meta.style,
  tag: meta.tag,
  shadowRootMode: meta.shadowRootMode,
})

// export const define = (
//   app: ((props: any) => App) | any,
//   meta: WcWrapperOptionsMeta
// ) => {
//   const isFunction = typeof app === 'function'
//   autoDefine({
//     tag: meta.tag,
//     shadowRootMode: meta.shadowRootMode,
//     create: isFunction ? app : undefined,
//     style: meta.style,
//     customElementComponent: isFunction
//       ? {
//           props: meta.attributes,
//           emits: meta.emits,
//         }
//       : app,
//   })
// }

export const define = (options: AutoDefineOptions) => {
  const attributes = Object.keys(options.customElementComponent.props || {})
  const emits = options.customElementComponent.emits || []
  const style = options.style || ''
  baseDefine(
    createOptions(
      {
        attributes,
        emits,
        tag: options.tag,
        style: style,
        shadowRootMode: options.shadowRootMode,
      },
      options.create ||
        ((props) =>
          createApp({
            render: () => h(options.customElementComponent, props),
          }))
    )
  )
}
