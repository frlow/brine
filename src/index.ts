import { kebabize } from './utils/kebab.js'

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

export const createWrapper = (wrapperOptions: WcWrapperOptions) =>
  class extends HTMLElement {
    self: any
    public static options: WcWrapperOptions = wrapperOptions
    get options(): WcWrapperOptions {
      return (this as any).constructor.options
    }

    emit = (name: string, detail?: any) => {
      this.self.dispatchEvent(new CustomEvent(kebabize(name), { detail }))
    }

    constructor() {
      super()
      this.self = this
      this.attachShadow({ mode: 'open' })
      this.init()
    }

    init() {
      const styleTag = document.createElement('style')
      styleTag.innerHTML = this.options.style
      this.shadowRoot!.appendChild(styleTag)
      this.options.init(this.self, this.emit)
    }

    static get observedAttributes() {
      return wrapperOptions.attributes || []
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      const regex = /(^[0-9|\.|,]*$)|(^{.*}$)|(^\[.*\]$)/
      const parsedNew = regex.test(newValue) ? JSON.parse(newValue) : newValue
      this.options.attributeChangedCallback(this.self, name, parsedNew)
    }

    connectedCallback() {
      this.options.connected(this.self, this.emit)
    }

    disconnectedCallback() {
      this.options.disconnected(this.self)
      this.shadowRoot!.innerHTML = ''
    }
  }

export const defineComponent = (wrapper: WcWrapper) => {
  if (!customElements.get(wrapper.options.tag))
    customElements.define(wrapper.options.tag, wrapper)
  else console.warn(`${wrapper.options.tag} is already loaded`)
}
