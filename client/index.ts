export type WcWrapperOptionsMeta = {
  attributes: string[]
  emits: string[]
  style: '.dummy-style{}' | string
  tag: string
}
export type WcWrapperState = any
export type WcWrapperOptions = {
  style: string
  tag: string
  constructor: (self: any, emit: (name: string, detail?: any) => void) => void
  attributes?: string[]
  attributeChangedCallback: (
    state: WcWrapperState,
    root: ShadowRoot,
    name: string,
    newValue: any
  ) => void
  connected: (
    state: WcWrapperState,
    root: ShadowRoot,
    emit: (name: string, detail?: any) => void
  ) => void
  disconnected: (state: WcWrapperState, root: ShadowRoot) => void
}
export type WcWrapper = ReturnType<typeof createWrapper>
export const createWrapper = (wrapperOptions: WcWrapperOptions) =>
  class extends HTMLElement {
    state = {}
    public static options: WcWrapperOptions = wrapperOptions
    get options(): WcWrapperOptions {
      return (this as any).constructor.options
    }

    emit = (name: string, detail?: any) => {
      this.shadowRoot!.host.dispatchEvent(new CustomEvent(name, { detail }))
    }

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      this.runConstructor()
    }

    runConstructor() {
      const styleTag = document.createElement('style')
      styleTag.innerHTML = this.options.style
      this.shadowRoot!.appendChild(styleTag)
      this.options.constructor(this, this.emit)
    }

    static get observedAttributes() {
      return wrapperOptions.attributes || []
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      const regex = /(^[0-9]*$)|(^{.*}$)|(^\[.*\]$)/
      const parsedNew = regex.test(newValue) ? JSON.parse(newValue) : newValue
      this.options.attributeChangedCallback(
        this.state,
        this.shadowRoot!,
        name,
        parsedNew
      )
    }

    connectedCallback() {
      this.options.connected(this.state, this.shadowRoot!, this.emit)
    }

    disconnectedCallback() {
      this.options.disconnected(this.state, this.shadowRoot!)
      this.shadowRoot!.innerHTML = ''
    }
  }

export const defineComponent = (wrapper: WcWrapper) => {
  if (!customElements.get(wrapper.options.tag))
    customElements.define(wrapper.options.tag, wrapper)
  else console.warn(`${wrapper.options.tag} is already loaded`)
}
