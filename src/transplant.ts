const createTransplantable = (tag: string) => {
  const startAttributes = (customElements.get(tag) as any).observedAttributes

  class Transplantable extends HTMLElement {
    private static elements: any[] = []
    private heart: any
    private static heartTag = tag
    private props: Record<string, any> = {}

    constructor() {
      super()
      this.heart = document.createElement(
        Object.getPrototypeOf(this).constructor.heartTag
      )
    }

    static get observedAttributes() {
      return startAttributes || []
    }

    private setProp(name: string, value: any) {
      if (name in this.heart) this.heart[name] = value
      else this.heart.setAttribute(name, value.toString())
      this.props[name] = value
    }

    private getProp(name: string) {
      return this.heart[name]
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      this.setProp(name, newValue)
    }

    connectedCallback() {
      const elements = Object.getPrototypeOf(this).constructor.elements
      elements.push(this)
      this.appendChild(this.heart)
    }

    disconnectedCallback() {
      const elements = Object.getPrototypeOf(this).constructor.elements
      elements.splice(elements.indexOf(this), 1)
      this.removeChild(this.heart)
    }

    private transplant(tag: string) {
      const newHeart = document.createElement(
        Object.getPrototypeOf(this).constructor.heartTag
      ) as any
      Object.entries(this.props).forEach(([key, value]) => {
        if (key in newHeart) newHeart[key] = value
        else newHeart.setAttribute(key, value.toString())
      })
      this.heart.replaceWith(newHeart)
      this.heart = newHeart
    }

    public static transplant(tag: string) {
      this.heartTag = tag
      this.elements.forEach((el) => el.transplant(tag))
    }
  }

  startAttributes.forEach((attribute: string) =>
    Object.defineProperty(Transplantable.prototype, attribute, {
      set: function (value: any) {
        this.setProp(attribute, value)
      },
      get: function () {
        return this.getProp(attribute)
      },
    })
  )

  return Transplantable
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
    if (ce.tags && !ce.tags.includes(name)) {
      ce.tempDefine(name, constructor, options)
      return
    }

    const heartName = name + '-' + (Math.random() + 1).toString(36).substring(7)
    ce.tempDefine(heartName, constructor, options)

    const existing = ce.get(name) as any

    if (existing) existing.transplant(heartName)
    else ce.tempDefine(name, createTransplantable(heartName))
  }
}
