export const camelize = (str: string) => {
  return str
    .split('-')
    .map(
      (part) =>
        part.slice(0, 1).substring(0, 1).toUpperCase() + part.substring(1)
    )
    .join('')
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