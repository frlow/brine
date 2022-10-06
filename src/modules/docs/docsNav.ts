import { Dictionary } from '../../utils/types'

const groupLinks = (links: string[]) =>
  links.reduce((acc, cur) => {
    const parts = cur.split('--')
    const key = parts[0]
    if (parts.length === 1) acc[key] = `#${cur}`
    else {
      const obj: Dictionary<string> =
        (acc[key] as Dictionary<string>) || (acc[key] = {})
      obj[parts[1]] = `#${cur}`
    }
    return acc
  }, {} as Dictionary<Dictionary<string> | string>)

export const getNav = (prefix: string, files: string[]) => {
  const groupedLinks = groupLinks(files)
  const links = Object.entries(groupedLinks)
    .map(([key, value]) => {
      const name = key.replace(/[0-9]*_?/g, '')
      if (typeof value === 'string') {
        return `<li className="docs-nav-root"><a href="${value}">${name}</a></li>`
      } else {
        return `<li className="docs-nav-root">${name}</li>
<ul>
${Object.entries(value)
  .map(
    ([linkKey, linkValue]) =>
      `<li className="docs-nav-sub"><a href="${linkValue}">${linkKey.replace(
        /[0-9]*_?/g,
        ''
      )}</a></li>`
  )
  .join('\n')}
</ul>`
      }
    })
    .join('\n')
  return `<nav>
        <${prefix}-docs-nav links='${JSON.stringify(groupedLinks)}'>
        <ul>
${links}
        </ul>
        </${prefix}-docs-nav>
    </nav>`
}
