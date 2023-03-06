export type WcWrapperOptionsMeta = {
  attributes: string[]
  emits?: string[]
  style: '.dummy-style{}' | string
  tag: string
  shadowRootMode?: shadowRootMode
}

export type shadowRootMode = 'open' | 'closed' | 'none'

export type WcWrapperOptions = {
  style?: string
  tag: string
  init: (
    self: any,
    root: ShadowRoot,
    emit: (name: string, detail?: any) => void
  ) => void
  attributes?: string[]
  attributeChangedCallback: (
    self: any,
    root: ShadowRoot,
    name: string,
    newValue: any
  ) => void
  connected: (
    self: any,
    root: ShadowRoot,
    emit: (name: string, detail?: any) => void
  ) => void
  disconnected: (self: any, root: ShadowRoot) => void
  shadowRootMode: shadowRootMode
}

export type AutoDefineOptions<T = any> = {
  customElementComponent: T
  create?: (props: any) => any
  tag: string
  style?: string
  shadowRootMode?: shadowRootMode
}

export const camelize = (str: string) => {
  const ret = str
    .split('-')
    .map(
      (part) =>
        part.slice(0, 1).substring(0, 1).toUpperCase() + part.substring(1)
    )
    .join('')
  return ret.substring(0, 1).toLowerCase() + ret.substring(1)
}

export const kebabize = (str: string) =>
  str
    .split('')
    .map((letter, idx) => {
      return /[A-Z|a-z]/.test(letter) && letter.toUpperCase() === letter
        ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
        : letter
    })
    .join('')
