const createTransplantable = (constructor: any) =>
  class extends (constructor as any) {
    static elements: any[] = []

    connectedCallback() {
      if (super.connectedCallback) super.connectedCallback()
      const elements = Object.getPrototypeOf(this).constructor.elements
      elements.push(this)
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) super.disconnectedCallback()
      const elements = Object.getPrototypeOf(this).constructor.elements
      elements.splice(elements.indexOf(this), 1)
    }

    transplantRenew() {
      const constr = Object.getPrototypeOf(this).constructor
      const refreshed = new constr()
      Object.entries(this.tempTranplantProps).forEach(([key, value]) =>
        key in this
          ? (refreshed[key] = value)
          : refreshed.setAttribute(key, value.toString())
      )
      delete this.tempTranplantProps
      this.shadowRoot.innerHTML = refreshed.shadowRoot.innerHTML
      Object.assign(this, refreshed)
      // if ('initCallback' in this) this.initCallback()
      this.connectedCallback()
    }

    transplantSendoff() {
      this.tempTranplantProps = {}
      Object.getPrototypeOf(this).constructor.observedAttributes?.forEach(
        (attribute: string) =>
          (this.tempTranplantProps[attribute] =
            this[attribute] || this.getAttribute(attribute))
      )
      this.disconnectedCallback()
    }

    static transplant(constructor: any) {
      const temp = [...this.elements]
      temp.forEach((e) => e.transplantSendoff())
      Object.setPrototypeOf(this, constructor)
      temp.forEach((e) => e.transplantRenew())
    }
  }

const ce = customElements as any
ce.tempDefine = ce.define
ce.define = (name: string, constructor: any, options: any) => {
  const Transplantable = createTransplantable(constructor)
  const existing = ce.get(name) as any
  existing?.transplant
    ? existing.transplant(constructor)
    : ce.tempDefine(name, Transplantable as any, options)
}

import('./apps/react')
await import('./apps/tester')
// await import('./apps/vue')
customElements.define('my-vue-app', class extends HTMLElement {})
await new Promise((r) => setTimeout(() => r(''), 3000))
await import('./apps/svelte')
