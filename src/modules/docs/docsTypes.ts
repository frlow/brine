import { kebabize } from '../../utils/kebabize'
import { DocTypePluginOptions } from './mdx'

export const generateDocsTypesImplementation = ({
  analysisResults,
  prefix,
}: Pick<DocTypePluginOptions, 'analysisResults' | 'prefix'>) => {
  const components = analysisResults.map((ar) => {
    const tag = `${prefix}-${kebabize(ar.name)}`
    const props = ar.props
      .map(
        (p) =>
          `${p.name}={args.${p.name} ? ${
            p.type.getText(ar.sourceFile) === 'string'
              ? `args.${p.name}`
              : `JSON.stringify(args.${p.name})`
          } : undefined}`
      )
      .join(' ')
    return `export const ${ar.name} = (args: any)=><${tag} ${props}>{args.children}</${tag}>`
  })

  const componentInfos = analysisResults.map((ar) => {
    const props = ar.props.map((p) => ({
      ...p,
      type: Buffer.from(p.type.getText(ar.sourceFile)).toString('base64'),
    }))
    const emits = ar.emits.map((e) => ({
      ...e,
      type: Buffer.from(e.type.getText(ar.sourceFile)).toString('base64'),
    }))
    const propsElements =
      props.length > 0
        ? `<div className="docs-info-props">
<h2>Properties</h2>
<table className="docs-info-table">
<tr>
    <th>Name</th>
    <th>Optional</th>
    <th>Type</th>
</tr>
${props
  .map(
    (p) => `<tr>
<td>${p.name}</td>
<td>${p.optional ? 'x' : ''}</td>
<td>{Buffer.from(\`${p.type}\`,'base64').toString()}</td>
</tr>`
  )
  .join('\n')}
</table>
</div>`
        : ''
    const emitsElements =
      emits.length > 0
        ? `<div className="docs-info-emits">
<h2>Emits</h2>
<table className="docs-info-table">
<tr>
    <th>Name</th>
    <th>Optional</th>
    <th>Type</th>
</tr>
${emits
  .map(
    (e) => `<tr>
<td>${e.name}</td>
<td>${e.optional ? 'x' : ''}</td>
<td>{Buffer.from(\`${e.type}\`,'base64').toString()}</td>
</tr>`
  )
  .join('\n')}
</table>
</div>`
        : ''
    return `export const ${ar.name}Info = () => <${prefix}-docs-info 
props='${JSON.stringify(props)}'
emits='${JSON.stringify(emits)}'
>
<div className="docs-info">
${propsElements}
${emitsElements}
</div>
</${prefix}-docs-info>`
  })
  const code = `import React from 'react'
const kebabize = (str: string) =>
  str
    .split('')
    .map((letter: any, idx: any) => {
      return letter.toUpperCase() === letter
        ? idx !== 0 ? '-' : ''+letter.toLowerCase()
        : letter
    })
    .join('')
const getInfo = (node: ReactNode): any => {
  const elements = (Array.isArray(node) ? node : [node]) as any
  return elements.map((el) => {
    const { children, ...propValues } = el.props || {}
    const props = Object.fromEntries(
      Object.entries(propValues).filter(([key]) => !key.match(/on[A-Z]/))
    )
    const emits = Object.keys(propValues).filter((key) => key.match(/on[A-Z]/))
    return {
      content: typeof el==="string"? el: undefined,
      tag: el.type?.name ? undefined : el.type,
      type: el.type?.name ? el.type.name : undefined,
      props: Object.keys(props).length > 0 ? props : undefined,
      emits: emits.length > 0 ? emits : undefined,
      children: children ? getInfo(children) : undefined,
    }
  })
}
const getReact = (info: any[])=>{
    return info.map(i=>{
        if(i.content) return i.content
        const tag = i.type || i.tag
        const props = i.props ? " "+Object.entries(i.props).map(([key, value])=>\`\${key}={\${JSON.stringify(value)}}\`).join(" "): ""
        const emits = i.emits ? " "+i.emits.map(e=>\`\${e}={ arg =>{ log(arg) }}\`).join(" ") : ''
        return \`<\${tag}\${props}\${emits}>\${i.children ? getReact(i.children) : ''}</\${tag}>\` 
    }).join("\\n")
}
const getVue = (info: any[])=>{
    return info.map(i=>{
        if(i.content) return i.content
        const tag = i.type || i.tag
        const props = i.props ? " "+Object.entries(i.props).map(([key, value])=>\`:\${key}='\${JSON.stringify(value)}'\`).join(" "): ""
        const emits = i.emits ? " "+i.emits.map(e=>\`@\${e.substring(2,3).toLowerCase()+e.substring(3)}="arg =>{ log(arg) }"\`).join(" ") : ''
        return \`<\${tag}\${props}\${emits}>\${i.children ? getVue(i.children) : ''}</\${tag}>\` 
    }).join("\\n")
}
const getCode = (info: any)=>{
    return {
        react: getReact(info),
        vue: getVue(info)
    }
}
  import {DocsExample} from './DocsExampleInternal'
  export const Example = ({children}: any)=>{
    const info = getInfo(children)
    return <DocsExample code={getCode(info)} info={info}>{children}</DocsExample>
  }
  ${components.join('\n')}
  ${componentInfos.join('\n')}
`
  debugger
  return code
}
