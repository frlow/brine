import type {
  WcWrapper,
  WcWrapperOptions,
  WcWrapperOptionsMeta,
} from './index.js'

export const defineComponent = (wrapper: WcWrapper) => {
  if (!customElements.get(wrapper.options.tag))
    customElements.define(wrapper.options.tag, wrapper)
  else console.warn(`${wrapper.options.tag} is already loaded`)
}

export const baseDefine = (
  createOptions: (...args: any[]) => WcWrapperOptions,
  component: any,
  meta: WcWrapperOptionsMeta
) => {
  const options = createOptions(component, meta)
  const registered = customElements.get(meta.tag) as any
  if (registered?.transplant) {
    registered.transplant(options)
    return
  }
  const wrapperFunc =
    process.env.NODE_ENV === 'production'
      ? require('./index.js').createWrapper
      : require('./extensions/transplant').createTransplantableWrapper
  const wrapper = wrapperFunc(options)
  customElements.define(meta.tag, wrapper)
}
