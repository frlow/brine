import { AnalysisResult } from '../analyze'
import fs from 'fs'
import path from 'path'
import { kebabize } from '../../utils/kebabize'
import { DocTypePluginOptions } from './mdx'

export const generateDocsTypes = async (
  analysisResults: AnalysisResult[],
  dist: string
) => {
  const code = `import * as React from 'react'
export declare type NodeInfo = {
  type?: string
  tag?: string
  props?: { [i: string]: any }
  emits?: string[]
  children?: NodeInfo[]
}
export declare type ExampleArgs = { 
  children: React.ReactNode, 
  code: {[i:string]:string},
  info: NodeInfo
  }
export declare const Example: (args: {
  children?: React.ReactNode
}) => JSX.Element

${analysisResults
  .map(
    (ar) => `export declare const ${ar.name}: (args: {
${ar.props
  .map(
    (p) => `${p.name}${p.optional ? '?' : ''}:${p.type.getText(ar.sourceFile)}`
  )
  .join(',')}
${ar.emits.map(
  (e) =>
    `${'on' + e.name.substring(0, 1).toUpperCase() + e.name.substring(1)}${
      e.optional ? '?' : ''
    }:boolean`
)}
  children?: React.ReactNode
}) => JSX.Element`
  )
  .join('\n\n')}`

  fs.writeFileSync(path.join(dist, 'DocsTypes.d.ts'), code, 'utf8')
}

export const generateDocsTypesImplementation = ({
  analysisResults,
  prefix,
}: DocTypePluginOptions) => {
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
  return `import React from 'react'
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
        const props = i.props ? " "+Object.entries(i.props).map(([key, value])=>\`\${key}='\${JSON.stringify(value)}'\`).join(" "): ""
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
  import {DocsExample} from './DocsExample'
  export const Example = ({children}: any)=>{
    const info = getInfo(children)
    return <DocsExample code={getCode(info)} info={info}>{children}</DocsExample>
  }
  ${components.join('\n')}
`
}