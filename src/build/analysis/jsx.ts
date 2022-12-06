import ts, { PropertySignature } from 'typescript'
import path from 'path'
import { AnalyzeFileFunction, PropDefinition, kebabize } from './index.js'
import ScriptTarget = ts.ScriptTarget
import SyntaxKind = ts.SyntaxKind

export const getPropsType = (path: string, code: string) => {
  const sourceFile: any = ts.createSourceFile(path, code, ScriptTarget.ESNext)
  const type =
    sourceFile.statements.find(
      (s: any) => s.kind === SyntaxKind.ExportAssignment
    )?.expression?.parameters[0]?.type ||
    sourceFile.statements.find(
      (s: any) =>
        s.kind === SyntaxKind.FunctionDeclaration &&
        s.modifiers?.some((m: any) => m.kind === SyntaxKind.DefaultKeyword)
    )?.parameters[0]?.type
  return { type, sourceFile }
}

export const analyzeJsxFile: AnalyzeFileFunction = async (filePath, code) => {
  const { type, sourceFile } = getPropsType(filePath, code)
  const props: PropDefinition[] =
    type?.members
      ?.filter(
        (d: PropertySignature) => d.type?.kind !== SyntaxKind.FunctionType
      )
      .map((e: any) => ({
        name: kebabize(e.name.text),
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
        const name = kebabize(e.name.text.replace(/^on/, ''))
        return {
          name,
          type: e.type.parameters[0]?.type.getText(sourceFile) || 'void',
        }
      }) || []
  const name = path.parse(filePath).name.split('.')[0]
  const slots = code
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
