import { SourceFile, TypeNode } from 'typescript'
import { HTMLDataV1, ITagData } from 'vscode-html-languageservice'
import { kebabize } from '../utils/kebabize'
import {
  GenericJsContribution,
  HtmlAttribute,
  JSONSchemaForWebTypes,
} from '../webTypes'
import path from 'path'
import { ElementsModule } from './Module'
import { WriteFileFunc } from '../utils/writeFile'

export type PropDefinition = {
  name: string
  type: TypeNode
  optional?: boolean
}
export type TypeImport = { names: string[]; file: string }
export type AnalysisResult = {
  sourceFile: SourceFile
  props: PropDefinition[]
  emits: PropDefinition[]
  // cssProperties: string[]
  slots: string[] | undefined
  name: string
  imported: string[]
}
export type AnalyzeFileFunction = (filePath: string) => Promise<AnalysisResult>

const getVsCodeCustomHtmlTag = (
  ar: AnalysisResult,
  prefix: string
): ITagData => {
  const tag: ITagData = {
    name: `${prefix}-${kebabize(ar.name)}`,
    attributes: ar.props.map((prop) => ({ name: prop.name })),
  }
  return tag
}
const generateVsCodeCustomHtml = (
  ars: AnalysisResult[],
  prefix: string
): HTMLDataV1 => ({
  tags: ars
    .map((ar) => getVsCodeCustomHtmlTag(ar, prefix))
    .concat([{ name: 'code', attributes: [] }]),
  version: 1.1,
})

const generateWebTypes = (
  results: AnalysisResult[],
  prefix: string
): JSONSchemaForWebTypes => ({
  $schema: 'http://json.schemastore.org/web-types',
  name: `${prefix}-components`,
  version: '0.0.0',
  'description-markup': 'markdown',
  contributions: {
    html: {
      elements: results
        .map((ar) => ({
          name: `${prefix}-${kebabize(ar.name)}`,
          attributes: ar.props.map(
            (prop) =>
              ({
                name: prop.name,
                value: {
                  type: prop.type.getText(ar.sourceFile),
                },
              } as HtmlAttribute)
          ),
          js: {
            events: ar.emits.map(
              (emit) =>
                ({ name: `${prefix}-${emit.name}` } as GenericJsContribution)
            ),
          },
        }))
        .concat([{ name: 'code', js: { events: [] }, attributes: [] }]),
    },
  },
})

export const analyze = async (
  dir: string,
  modules: ElementsModule[],
  prefix: string,
  dist: string,
  writeFile: WriteFileFunc
) => {
  const results = await Promise.all(
    modules.flatMap((module) =>
      module.findMatchingFiles(dir).map((file) => module.analyzeFunc(file))
    )
  )
  const vscodeCustom = generateVsCodeCustomHtml(results, prefix)
  const webTypes = generateWebTypes(results, prefix)

  writeFile(
    path.join(dist, 'vscode.html-custom-data.json'),
    JSON.stringify(vscodeCustom, null, 2)
  )
  writeFile(
    path.join(dist, 'web-types.json'),
    JSON.stringify(webTypes, null, 2)
  )

  return { analysisResults: results }
}
