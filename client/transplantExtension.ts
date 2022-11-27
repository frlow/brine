import { WcWrapper, WcWrapperOptions } from '@frlow/brine/client/index'

const w = window as any
export const createTransplantableWrapper = (
  classObj: WcWrapper,
  once: boolean = false
): WcWrapper => {
  const wrapperClass = class extends classObj {
    constructor() {
      super()
    }

    connectedCallback() {
      super.connectedCallback()
      const self: any = this.constructor
      if (self.enable) self.transplantable.push(this)
    }

    disconnectedCallback() {
      super.disconnectedCallback()
      const self: any = this.constructor
      if (self.enable)
        self.transplantable.splice(self.transplantable.indexOf(this), 1)
    }

    public reload() {
      this.disconnectedCallback()
      this.runConstructor()
      Array.from(this.attributes)
        .filter((d) => !d.name.startsWith('data-') && !d.name.startsWith('x-'))
        .forEach((a) => this.attributeChangedCallback(a.name, '', a.value))
      this.connectedCallback()
    }

    static enable = true
    static transplantable: any[] = []

    public static transplant(options: WcWrapperOptions, once: boolean) {
      this.options = options
      this.transplantable.forEach((t) => t.reload(options))
      if (once) {
        this.enable = false
        this.transplantable = []
        delete w.hmr[classObj.options.tag]
      }
    }

    public static fallback() {
      w.hmr[classObj.options.tag].transplant(wrapperClass.options, once)
      super.fallback()
    }
  }
  if (!w.hmr) w.hmr = {}
  if (!w.hmr[classObj.options.tag]) w.hmr[classObj.options.tag] = wrapperClass
  return wrapperClass
}
