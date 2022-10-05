import { AnalysisResult } from '../analyze'

const getComponent = (ar: AnalysisResult) => `export declare const ${
  ar.name
}: (args: {
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
  children?: React.ReactNode,
  className?: string
}) => JSX.Element`

const getComponentInfo = (ar: AnalysisResult) =>
  `export declare const ${ar.name}Info : ()=>JSX.Element`

export const generateDocsTypes = async (analysisResults: AnalysisResult[]) => {
  const components = analysisResults.map((ar) => getComponent(ar)).join('\n\n')
  const componentInfos = analysisResults
    .map((ar) => getComponentInfo(ar))
    .join('\n\n')
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

${components}

${componentInfos}`

  return code
}
