export const camelize = (str: string) => {
  return str
    .split('-')
    .map((part) => part.substring(0, 1).toUpperCase() + part.substring(1))
    .join('')
}
