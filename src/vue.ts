import { App, createApp, h, reactive } from '@vue/runtime-dom'
import {
  WcWrapperOptions,
  WcWrapperOptionsMeta,
  camelize,
  AutoDefineOptions,
} from './common.js'
import { baseDefine } from './define.js'

export const createOptions = (
  component: any,
  meta: WcWrapperOptionsMeta,
  createCustom?: (component: any, props: any) => App
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
    meta.emits.forEach(
      (e) => (self.props[camelize(`on-${e}`)] = (args: any) => emit(e, args))
    )
    self.app = createCustom
      ? createCustom(component, self.props)
      : createApp({
          render: () => h(component, self.props),
        })
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

export const define = (
  app: ((props: any) => App) | any,
  meta: WcWrapperOptionsMeta
) => {
  const creteApp =
    typeof app === 'function'
      ? (_: unknown, props: any) => app(props)
      : undefined
  baseDefine(createOptions(app, meta, creteApp), meta.tag)
}

export const autoDefine = (options: AutoDefineOptions) => {
  const attributes = Object.keys(options.customElementComponent.props || {})
  const emits = options.customElementComponent.emits || []
  const style = options.style || ''
  baseDefine(
    createOptions(
      options.customElementComponent,
      {
        attributes,
        emits,
        tag: options.tag,
        style: style,
        shadowRootMode: options.shadowRootMode,
      },
      options.create
    ),
    options.tag
  )
}
