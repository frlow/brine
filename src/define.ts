import type { WcWrapperOptions } from './common.js'
import { makeWrapperTransplantable } from './transplant.js'
import { camelize } from './common.js'

const validateOptions = (wrapperOptions: WcWrapperOptions) => {
  const camelAttributes = wrapperOptions.attributes.filter((a) =>
    /[A-Z]/.test(a)
  )
  if (camelAttributes.length > 0)
    throw `Attributes cannot contain uppercase letters, use kebab-cased names instead.
  The following attributes needs to have their names updated: ${camelAttributes.join(
    ', '
  )}`
}

const createWrapper = (wrapperOptions: WcWrapperOptions) => {
  validateOptions(wrapperOptions)
  const wrapper = class extends HTMLElement {
    private readonly self: any
    private root: ShadowRoot
    public static options: WcWrapperOptions = wrapperOptions
    get options(): WcWrapperOptions {
      return (this as any).constructor.options
    }

    emit = (name: string, detail?: any) => {
      this.self.dispatchEvent(new CustomEvent(name, { detail }))
    }

    constructor() {
      super()
      this.self = this
      this.root = this.attachShadow({ mode: 'closed' })
      this.initCallback()
    }

    initCallback() {
      const styleTag = document.createElement('style')
      styleTag.innerHTML = this.options.style
      this.root!.appendChild(styleTag)
      this.options.init(this.self, this.root, this.emit)
    }

    static get observedAttributes() {
      return wrapperOptions.attributes || []
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      this.updateProp(camelize(name), newValue)
    }

    updateProp(name: string, value: any) {
      this.options.attributeChangedCallback(this.self, this.root, name, value)
    }

    connectedCallback() {
      this.options.connected(this.self, this.root, this.emit)
    }

    disconnectedCallback() {
      this.options.disconnected(this.self, this.root)
      this.root!.innerHTML = ''
    }
  }

  wrapperOptions.attributes.forEach((attribute) => {
    const camelName = camelize(attribute)
    Object.defineProperty(wrapper.prototype, camelName, {
      set: function (value: any) {
        this.updateProp(camelName, value)
      },
    })
  })

  return wrapper
}

export const baseDefine = (
  options: WcWrapperOptions,
  tag: string,
  extendFunction?: any
) => {
  const registered = customElements.get(tag) as any
  if (registered?.transplant) {
    registered.transplant(options)
    return
  }
  let wrapper = createWrapper(options)
  if (extendFunction) wrapper = extendFunction(wrapper)
  else if (process.env.NODE_ENV === 'development')
    wrapper = makeWrapperTransplantable(wrapper)
  customElements.define(tag, wrapper)
}
