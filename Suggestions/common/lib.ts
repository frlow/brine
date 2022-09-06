export type Example<T> = {
  example: T
}

export const example = <T>(item: T): Example<T> => {
  return { example: item }
}

export const doc = (...parts: (string | Example<any>)[]) => {
  return ''
}
