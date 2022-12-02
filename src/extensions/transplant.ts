import { createWrapper, WcWrapper, WcWrapperOptions } from '../index.js'

export const createTransplantableWrapper = (
  options: WcWrapperOptions
): WcWrapper => {
  const wrapper = createWrapper(options)
  return class extends wrapper {
    connectedCallback() {
      super.connectedCallback()
      const self: any = this.constructor
      if (self.enable) self.transplantable.push(this)
    }

    public disconnectedCallback() {
      super.disconnectedCallback()
      const self: any = this.constructor
      if (self.enable)
        self.transplantable.splice(self.transplantable.indexOf(this), 1)
    }

    public reload() {
      this.init()
      Array.from(this.attributes)
        .filter((d) => !d.name.startsWith('data-') && !d.name.startsWith('x-'))
        .forEach((a) => this.attributeChangedCallback(a.name, '', a.value))
      this.connectedCallback()
    }

    static transplantable: any[] = []
    static enable = true

    public static transplant(
      options: WcWrapperOptions,
      disable: boolean = false
    ) {
      if (!this.enable) return
      const temp = [...this.transplantable]
      temp.forEach((t) => t.disconnectedCallback())
      this.options = options
      if (disable) this.enable = false
      temp.forEach((t) => t.reload())
    }
  }
}
