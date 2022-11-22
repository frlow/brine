import ts, { PropertySignature } from 'typescript'
import fs from 'fs'
import path from 'path'
import { AnalyzeFileFunction, getComponentName, PropDefinition } from './common'
import ScriptTarget = ts.ScriptTarget
import SyntaxKind = ts.SyntaxKind
import { kebabize } from '../utils/string'

export const getPropsType = (path: string) => {
  const text = fs.readFileSync(path.split('?')[0], 'utf8')
  const sourceFile: any = ts.createSourceFile(path, text, ScriptTarget.ESNext)
  const type =
    sourceFile.statements.find(
      (s: any) => s.kind === SyntaxKind.ExportAssignment
    )?.expression?.parameters[0]?.type ||
    sourceFile.statements.find(
      (s: any) =>
        s.kind === SyntaxKind.FunctionDeclaration &&
        s.modifiers?.some((m: any) => m.kind === SyntaxKind.DefaultKeyword)
    )?.parameters[0]?.type
  return { type, sourceFile, text }
}

export const analyzeJsxFile: AnalyzeFileFunction = async (filePath: string) => {
  const { type, sourceFile, text } = getPropsType(filePath)
  const props: PropDefinition[] =
    type?.members
      ?.filter(
        (d: PropertySignature) => d.type?.kind !== SyntaxKind.FunctionType
      )
      .map((e: any) => ({
        name: e.name.text,
        type: e.type.getText(sourceFile),
        optional: !!e.questionToken,
      }))
      .filter((m: any) => m.name !== 'children') || []
  const emits: PropDefinition[] =
    type?.members
      ?.filter(
        (d: PropertySignature) => d.type?.kind === SyntaxKind.FunctionType
      )
      .map((e: any) => {
        const name = e.name.text.replace(/^on/, '')
        const lowercaseName =
          name.substring(0, 1).toLowerCase() + name.substring(1)
        return {
          name: lowercaseName,
          optional: !!e.questionToken,
          type: e.type.parameters[0]?.type.getText(sourceFile) || 'void',
        }
      }) || []
  const name = getComponentName(path.parse(filePath).name)
  const slots = text
    .match(/<slot(.*?)>/g)
    ?.map((d) => (d.match(/name="(.*?)"/) || [])[1])
    .filter((d) => d)
  const tag = kebabize(name)
  return {
    props,
    emits,
    name,
    slots,
    tag,
  }
}
