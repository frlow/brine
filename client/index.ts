import { defineHotReloadedComponent } from './hmr'

export type WcWrapperState = any
export type WcWrapperOptions = {
  style: string
  constructor: (
    self: any,
    emit: (name: string, detail?: any) => void,
    transplant: (opts: WcWrapperOptions) => void
  ) => void
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
export const createWrapper = (wrapperOptions: WcWrapperOptions) =>
  class extends HTMLElement {
    state = {}
    wrapper: WcWrapperOptions = {} as WcWrapperOptions
    emit = (name: string, detail?: any) => {
      this.shadowRoot!.host.dispatchEvent(new CustomEvent(name, { detail }))
    }

    constructor() {
      super()
      this.wrapper = wrapperOptions
      this.attachShadow({ mode: 'open' })
      this.runConstructor()
    }

    runConstructor() {
      const styleTag = document.createElement('style')
      styleTag.innerHTML = this.wrapper.style
      this.shadowRoot!.appendChild(styleTag)
      this.wrapper.constructor(this, this.emit, (opts: WcWrapperOptions) =>
        this.transplant(opts)
      )
    }

    static get observedAttributes() {
      return wrapperOptions.attributes || []
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      this.wrapper.attributeChangedCallback(
        this.state,
        this.shadowRoot!,
        name,
        oldValue,
        newValue
      )
    }

    connectedCallback() {
      this.wrapper.connected(this.state, this.shadowRoot!, this.emit)
    }

    disconnectedCallback() {
      this.wrapper.disconnected(this.state, this.shadowRoot!)
      this.shadowRoot!.innerHTML = ''
    }

    public transplant(opts: WcWrapperOptions) {
      this.disconnectedCallback()
      this.wrapper = opts
      this.runConstructor()
      this.connectedCallback()
      const attributes = Array.from(this.attributes)
      attributes
        .filter((d) => !d.name.startsWith('data-') && !d.name.startsWith('x-'))
        .forEach((a) => this.attributeChangedCallback(a.name, '', a.value))
    }
  }

export const defineComponent = (
  tag: string,
  wrapper: WcWrapperOptions,
  hmr: boolean
) => {
  if (hmr) defineHotReloadedComponent(tag, wrapper)
  else customElements.define(tag, createWrapper(wrapper))
}
