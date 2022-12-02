export const camelize = (str: string) => {
  return str
    .split('-')
    .map((part) => part.substring(0, 1).toUpperCase() + part.substring(1))
    .join('')
}

export const kebabize = (str: string) =>
  str
    .split('')
    .map((letter, idx) => {
      return letter.toUpperCase() === letter && letter !== '-'
        ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
        : letter
    })
    .join('')
