export type WcWrapperState = any
export type WcWrapperOptions = {
  constructor: (self: any, emit: (name: string, detail?: any) => void) => void
  attributes?: string[]
  attributeChangedCallback: (
    state: WcWrapperState,
    root: ShadowRoot,
    name: string,
    oldValue: string,
    newValue: string
  ) => void
  connected: (
    state: WcWrapperState,
    root: ShadowRoot,
    emit: (name: string, detail?: any) => void
  ) => void
  disconnected: (state: WcWrapperState, root: ShadowRoot) => void
}
export const createWrapper = (opts: WcWrapperOptions, style: string) =>
  class extends HTMLElement {
    state = {}
    emit = (name: string, detail?: any) => {
      this.shadowRoot!.host.dispatchEvent(new CustomEvent(name, { detail }))
    }

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
      const styleTag = document.createElement('style')
      styleTag.innerText = style
      this.shadowRoot!.appendChild(styleTag)
      opts.constructor(this, this.emit)
    }

    static get observedAttributes() {
      return opts.attributes || []
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      opts.attributeChangedCallback(
        this.state,
        this.shadowRoot!,
        name,
        oldValue,
        newValue
      )
    }

    connectedCallback() {
      opts.connected(this.state, this.shadowRoot!, this.emit)
    }

    disconnectedCallback() {
      opts.disconnected(this.state, this.shadowRoot!)
      this.shadowRoot!.innerHTML = ''
    }
  }
