export const defineComponent = (
  component: any | ((element: HTMLElement, props: any) => any),
  meta: {
    attributes: string[]
    emits: string[]
    style: string
    tag: string
  }
) => {
  const wrapper = class extends HTMLElement {
    private root: ShadowRoot
    private tempProps: Record<string, any> = {}
    private app: any

    constructor() {
      super()
      this.root = this.attachShadow({ mode: 'closed' })
      const styleTag = document.createElement('style')
      styleTag.innerHTML = meta.style
      this.root.appendChild(styleTag)
    }

    static get observedAttributes() {
      return meta.attributes || []
    }

    private setProp(name: string, value: any) {
      if (this.app)
        this.app.$$set({
          [name]: value,
        })
      else this.tempProps[name] = value
    }

    private emit(name: string, detail?: any) {
      this.dispatchEvent(
        new CustomEvent(name, { detail, bubbles: true, cancelable: false })
      )
    }

    connectedCallback() {
      const mountPoint = document.createElement('div')
      this.app = component.toString().startsWith('class')
        ? new component({ target: mountPoint, props: this.tempProps })
        : component(mountPoint, this.tempProps)
      delete this.tempProps
      meta.emits.forEach(
        (e) =>
          (this.app.$$.callbacks[e] = [
            (arg: any) => {
              this.emit(e, arg.detail)
            },
          ])
      )
      this.root.appendChild(mountPoint)
    }

    disconnectedCallback() {
      this.app.$$.on_disconnect?.forEach((f: any) => f())
      this.app.$$.on_destroy?.forEach((f: any) => f())
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      this.setProp(name, newValue)
    }
  }

  meta.attributes.forEach((attribute) =>
    Object.defineProperty(wrapper.prototype, attribute, {
      set: function (value: any) {
        this.setProp(attribute, value)
      },
    })
  )

  customElements.define(meta.tag, wrapper)
}
