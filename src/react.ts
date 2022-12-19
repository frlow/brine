import { createElement } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { camelize } from './utils/kebab.js'

export const defineComponent = (
  Component: (args: any) => JSX.Element,
  meta: {
    attributes: string[]
    emits: string[]
    style: string
    tag: string
  }
) => {
  const wrapper = class extends HTMLElement {
    private root: ShadowRoot
    private app: Root
    private props: any = {}

    private render() {
      this.app.render(createElement(Component, this.props))
    }

    constructor() {
      super()
      this.root = this.attachShadow({ mode: 'closed' })
      const styleTag = document.createElement('style')
      styleTag.innerHTML = meta.style
      this.root.appendChild(styleTag)
      const container = document.createElement('div')
      this.root.appendChild(container)
      this.app = createRoot(container)

      meta.emits.forEach((e) => {
        this.props[camelize(`on-${e}`)] = (arg: any) => {
          this.emit(e, arg)
        }
      })
    }

    static get observedAttributes() {
      return meta.attributes || []
    }

    private setProp(name: string, value: any) {
      this.props[name] = value
      this.render()
    }

    private emit(name: string, detail?: any) {
      this.dispatchEvent(
        new CustomEvent(name, { detail, bubbles: true, cancelable: false })
      )
    }

    connectedCallback() {
      this.render()
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
