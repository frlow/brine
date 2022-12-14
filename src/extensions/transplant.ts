import { createWrapper, WcWrapper, WcWrapperOptions } from '../index.js'

export const createTransplantableWrapper = (
  options: WcWrapperOptions
): WcWrapper => {
  const wrapper = createWrapper(options)
  return class extends wrapper {
    transplantProps: { [i: string]: any } = {}

    connectedCallback() {
      super.connectedCallback()
      const self: any = this.constructor
      self.transplantable.push(this)
    }

    public disconnectedCallback() {
      super.disconnectedCallback()
      const self: any = this.constructor
      self.transplantable.splice(self.transplantable.indexOf(this), 1)
    }

    updateProp(name: string, value: any) {
      this.transplantProps[name] = value
      super.updateProp(name, value)
    }

    public reload() {
      this.initCallback()
      Object.entries(this.transplantProps).forEach(([key, value]) =>
        super.updateProp(key, value)
      )
      this.connectedCallback()
    }

    static transplantable: any[] = []

    public static transplant(options: WcWrapperOptions) {
      const temp = [...this.transplantable]
      temp.forEach((t) => t.disconnectedCallback())
      this.options = options
      temp.forEach((t) => t.reload())
    }
  }
}
