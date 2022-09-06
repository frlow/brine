export type Example = {
  example: string
}

export const example = <T>(item: T): Example => {
  return { example: 'sdöfoijsodif' }
}

export const doc = (...parts: (string | Example)[]) => {
  return ''
}
