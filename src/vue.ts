import { App, createApp, h, reactive } from '@vue/runtime-dom'
import { camelize } from './utils/kebab.js'

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
    private props = reactive<any>({})
    private app: App

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
      this.props[name] = value
    }

    private emit(name: string, detail?: any) {
      this.dispatchEvent(
        new CustomEvent(name, { detail, bubbles: true, cancelable: false })
      )
    }

    connectedCallback() {
      const mountPoint = document.createElement('div')
      this.root.appendChild(mountPoint)
      meta.emits.forEach(
        (e) =>
          (this.props[camelize(`on-${e}`)] = (args: any) => this.emit(e, args))
      )
      this.app =
        typeof component === 'function'
          ? component(this.props)
          : createApp({
              render: () => h(component, this.props),
            })
      this.app.mount(mountPoint)
    }

    disconnectedCallback() {
      this.app.unmount()
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
