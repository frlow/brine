import { AnalysisResult } from '../analyze'
import { docsTypeStatic } from './docsTypeStatic'
import fs from 'fs'
import path from 'path'
import { kebabize } from '../../utils/kebabize'

export const generateDocsTypes = async (
  analysisResults: AnalysisResult[],
  dist: string,
  prefix: string
) => {
  let code = docsTypeStatic
  code += `\nexport const Example = CreateExample('${prefix}')\n\n`
  analysisResults.forEach((ar) => {
    const props = ar.props.map((p) => ({
      name: p.name,
      type: p.type.getText(ar.sourceFile),
      optional: p.optional,
    }))
    const emits = ar.emits.map((e) => ({
      name: `on${e.name.substring(0, 1).toUpperCase()}${e.name.substring(1)}`,
      type: 'boolean',
      optional: e.optional,
    }))
    const children = {
      type: 'React.ReactNode',
      optional: true,
      name: 'children',
    }
    code += `export const ${ar.name} = ({
  ${props
    .concat(emits)
    .concat(children)
    .map((e) => e.name)}
}: {
  ${props
    .concat(emits)
    .concat(children)
    .map((e) => `${e.name}${e.optional ? '?' : ''}:${e.type}`)}
}) => {
  return <ex-${kebabize(ar.name)} ${props
      .map((p) => `${p.name}={${p.name}}`)
      .join(' ')}>{children}</ex-${kebabize(ar.name)}>
}

`
  })
  fs.writeFileSync(path.join(dist, 'DocsTypes.tsx'), code, 'utf8')
}
