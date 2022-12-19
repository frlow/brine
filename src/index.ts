export type WcWrapperOptionsMeta = {
  attributes: string[]
  emits: string[]
  style: '.dummy-style{}' | string
  tag: string
}
export type WcWrapperOptions = {
  style: string
  tag: string
  init: (self: any, emit: (name: string, detail?: any) => void) => void
  attributes?: string[]
  attributeChangedCallback: (self: any, name: string, newValue: any) => void
  connected: (self: any, emit: (name: string, detail?: any) => void) => void
  disconnected: (self: any) => void
}
export type WcWrapper = ReturnType<typeof createWrapper>

export const createWrapper = (wrapperOptions: WcWrapperOptions) => {
  const wrapper = class extends HTMLElement {
    public static options: WcWrapperOptions = wrapperOptions
    get options(): WcWrapperOptions {
      return (this as any).constructor.options
    }

    emit = (name: string, detail?: any) => {
      this.dispatchEvent(
        new CustomEvent(name, { detail, bubbles: true, cancelable: false })
      )
    }

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.initCallback()
    }

    initCallback() {
      const styleTag = document.createElement('style')
      styleTag.innerHTML = this.options.style
      this.shadowRoot!.appendChild(styleTag)
      this.options.init(this, this.emit)
    }

    static get observedAttributes() {
      return wrapperOptions.attributes || []
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      this.updateProp(name, newValue)
    }

    updateProp(name: string, value: any) {
      this.options.attributeChangedCallback(this, name, value)
    }

    connectedCallback() {
      this.options.connected(this, this.emit)
    }

    disconnectedCallback() {
      this.options.disconnected(this)
      this.shadowRoot!.innerHTML = ''
    }
  }

  wrapperOptions.attributes.forEach((attribute) =>
    Object.defineProperty(wrapper.prototype, attribute, {
      set: function (value: any) {
        this.updateProp(attribute, value)
      },
    })
  )

  return wrapper
}

export const defineComponent = (wrapper: WcWrapper) => {
  customElements.define(wrapper.options.tag, wrapper)
}
