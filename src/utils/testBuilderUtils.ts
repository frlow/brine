import { GenericComponent } from '../modules/Module'

export const generateJsx = (
  component: GenericComponent,
  logFunction: string
): string => {
  const children =
    component.children?.map((ch) => generateJsx(ch, logFunction)).join('') || ''
  const props = Object.entries(component.props || {})
    .map(
      ([key, value]) =>
        `${key}={${
          typeof value === 'string' ? `"${value}"` : JSON.stringify(value)
        }}`
    )
    .join(' ')
  const emits = Object.entries(component.emits || {})
    .map(
      ([key, value]) =>
        `on${key.substring(0, 1).toUpperCase()}${key.substring(
          1
        )}={${logFunction}}`
    )
    .join(' ')
  return `<${component.name} ${props} ${emits} ${
    component.slot ? `slot="${component.slot}"` : ''
  }>${children}</${component.name}>`
}

export const loadedSnippet = `const loadedElement = document.createElement("div")
loadedElement.id = 'isLoaded'
document.body.appendChild(loadedElement)`
