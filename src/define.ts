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

export const createWrapper = (wrapperOptions: WcWrapperOptions) => {
  validateOptions(wrapperOptions)
  const wrapper = class extends HTMLElement {
    readonly self: any
    readonly root: any
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
      this.root =
        wrapperOptions.shadowRootMode === 'none'
          ? this
          : this.attachShadow({
              mode: wrapperOptions.shadowRootMode || 'closed',
            })
      this.initCallback()
    }

    initCallback() {
      this.options.init(this.self, this.root, this.emit)
    }

    static get observedAttributes() {
      return wrapperOptions.attributes || []
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      this.updateProp(name, newValue)
    }

    updateProp(name: string, value: any) {
      this.options.attributeChangedCallback(
        this.self,
        this.root,
        camelize(name),
        value
      )
    }

    connectedCallback() {
      if (this.options.style) {
        const styleTag = document.createElement('style')
        styleTag.innerHTML = this.options.style
        this.root!.appendChild(styleTag)
      }
      this.options.connected(this.self, this.root, this.emit)
    }

    disconnectedCallback() {
      this.options.disconnected(this.self, this.root)
      this.root!.innerHTML = ''
    }
  }

  wrapperOptions.attributes.forEach((attribute) => {
    const setter = {
      set: function (value: any) {
        this.updateProp(attribute, value)
      },
    }
    Object.defineProperty(wrapper.prototype, attribute, setter)
    if (camelize(attribute) !== attribute)
      Object.defineProperty(wrapper.prototype, camelize(attribute), setter)
  })

  return wrapper
}

export const baseDefine = (options: WcWrapperOptions) => {
  const registered = customElements.get(options.tag) as any
  if (registered?.transplant) return registered.transplant(options)
  let wrapper = createWrapper(options)
  if (process.env.NODE_ENV === 'development')
    wrapper = makeWrapperTransplantable(wrapper)
  customElements.define(options.tag, wrapper)
}
