const createTransplantable = (componentClass: any) => {
  const startAttributes = componentClass.observedAttributes

  const prepareInnerClass = (classToPrepare: any) => {
    Object.setPrototypeOf(
      classToPrepare,
      class {
        dispatchEvent: (ev: Event) => void
        attachShadow: (options: any) => Partial<ShadowRoot>
        connectExternalRoot: (root: ShadowRoot) => void
        transplantProps: {
          externalRoot: ShadowRoot
          shadowOptions: any
          shadowChildren: any[]
        }

        constructor() {
          const self = this
          this.transplantProps = {
            shadowChildren: [],
          } as any
          this.connectExternalRoot = (root) => {
            self.transplantProps.externalRoot = root
            self.transplantProps.shadowChildren.forEach((child) =>
              root.appendChild(child)
            )
            self.transplantProps.shadowChildren = []
          }
          this.dispatchEvent = (ev) =>
            self.transplantProps.externalRoot.host.dispatchEvent(ev)
          this.attachShadow = (options) => {
            self.transplantProps.shadowOptions = options
            return {
              appendChild<T extends Node>(node: T): T {
                if (self.transplantProps.externalRoot)
                  self.transplantProps.externalRoot.appendChild(node)
                else self.transplantProps.shadowChildren.push(node)
                return node
              },
            }
          }
        }
      }
    )
    return class extends classToPrepare {}
  }

  const ret = class Transplantable extends HTMLElement {
    private static elements: any[] = []
    private static innerClass: any = componentClass
    private innerObj: any
    private outerShadowRoot: ShadowRoot
    private transplantTempProps: any = {}

    constructor() {
      super()
      this.refresh()
    }

    static get observedAttributes() {
      return startAttributes || []
    }

    connectedCallback() {
      const elements = Object.getPrototypeOf(this).constructor.elements
      elements.push(this)
      if (this.innerObj.connectedCallback) this.innerObj.connectedCallback()
    }

    disconnectedCallback() {
      const elements = Object.getPrototypeOf(this).constructor.elements
      elements.splice(elements.indexOf(this), 1)
      if (this.innerObj.disconnectedCallback)
        this.innerObj.disconnectedCallback()
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      this.setProp(name, newValue)
    }

    setProp(attribute: string, value: any) {
      this.transplantTempProps[attribute] = value
      if (attribute in this.innerObj) this.innerObj[attribute] = value
      else if (this.innerObj.attributeChangedCallback)
        this.innerObj.attributeChangedCallback(attribute, null, value)
    }

    private refresh() {
      this.innerObj = new (prepareInnerClass(
        Object.getPrototypeOf(this).constructor.innerClass
      ))()
      if (
        this.innerObj.transplantProps.shadowOptions &&
        !this.outerShadowRoot
      ) {
        this.outerShadowRoot = this.attachShadow(
          this.innerObj.transplantProps.shadowOptions
        )
      }
      if (this.outerShadowRoot)
        this.innerObj.connectExternalRoot(this.outerShadowRoot)
      Object.entries(this.transplantTempProps).forEach(([attribute, value]) => {
        if (attribute in this.innerObj) this.innerObj[attribute] = value
        else if (this.innerObj.attributeChangedCallback)
          this.innerObj.attributeChangedCallback(attribute, null, value)
      })
    }

    public static transplant(updatedClass: string) {
      const proto = Object.getPrototypeOf(updatedClass)
      if (proto !== HTMLElement) {
        throw 'Not HTMLElement'
      }
      this.innerClass = updatedClass
      const temp = [...this.elements]
      temp.forEach((el) => el.disconnectedCallback())
      temp.forEach((el) => el.refresh())
      temp.forEach((el) => el.connectedCallback())
    }
  }

  startAttributes.forEach((attribute: string) =>
    Object.defineProperty(ret.prototype, attribute, {
      set: function (value: any) {
        this.setProp(attribute, value)
      },
    })
  )

  return ret
}

export const initTransplant = (tags?: string[]) => {
  const ce = customElements as any
  if (!tags) ce.tags = null
  else if (ce.tags) {
    ce.tags = ce.tags
      .concat(...tags)
      .filter((d: string, i: number, arr: string[]) => arr.indexOf(d) === i)
  } else ce.tags = tags

  if (ce.tempDefine) return
  ce.tempDefine = ce.define
  ce.define = (name: string, constructor: any, options: any) => {
    const existing = ce.get(name) as any
    if (ce.tags && !ce.tags.includes(name))
      ce.tempDefine(name, constructor, options)
    if (existing) existing.transplant(constructor)
    else ce.tempDefine(name, createTransplantable(constructor))
  }
}
