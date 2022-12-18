const createTransplantable = (constructor: any) =>
  class extends (constructor as any) {
    static elements: any[] = []

    connectedCallback() {
      super.connectedCallback()
      const elements = Object.getPrototypeOf(this).constructor.elements
      elements.push(this)
    }

    disconnectedCallback() {
      super.disconnectedCallback()
      const elements = Object.getPrototypeOf(this).constructor.elements
      elements.splice(elements.indexOf(this), 1)
    }

    transplantRenew() {
      if ('initCallback' in this) this.initCallback()
      Object.entries(this.tempTranplantProps).forEach(
        ([key, value]) => (this[key] = value)
      )
      delete this.tempTranplantProps
      this.connectedCallback()
    }

    transplantSendoff() {
      this.tempTranplantProps = {}
      Object.getPrototypeOf(this).constructor.observedAttributes.forEach(
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
await import('./apps/vue')
await new Promise((r) => setTimeout(() => r(''), 3000))
await import('./apps/svelte')
