import ts, {
  PropertySignature,
  ScriptTarget,
  SyntaxKind,
  SourceFile,
  ImportDeclaration,
} from 'typescript'
import fs from 'fs'
import { AnalyzeFileFunction, PropDefinition } from '../analyze'
import path from 'path'
import { getComponentName } from '../../utils/findFiles'

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

const getImported = (sourceFile: SourceFile): string[] => {
  const imported = sourceFile.statements.filter(
    (d) => d.kind === SyntaxKind.ImportDeclaration
  ) as ImportDeclaration[]
  const wrappers = imported.find(
    (d: any) => d.moduleSpecifier?.text === '~react'
  ) as any
  if (!wrappers) return []
  return wrappers?.importClause?.namedBindings?.elements?.map(
    (e: any) => e.name.text
  )
}

export const analyzeReactFile: AnalyzeFileFunction = async (
  filePath: string
) => {
  const { type, sourceFile, text } = getPropsType(filePath)
  const imported = getImported(sourceFile)
  const props: PropDefinition[] =
    type?.members
      ?.filter(
        (d: PropertySignature) => d.type?.kind !== SyntaxKind.FunctionType
      )
      .map((e: any) => ({
        name: e.name.text,
        type: e.type,
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
          type: e.type.parameters[0]?.type || {
            kind: SyntaxKind.VoidKeyword,
            getText: () => 'void',
          },
        }
      }) || []
  const name = getComponentName(path.parse(filePath).name)
  const slots = text
    .match(/<slot(.*?)>/g)
    ?.map((d) => (d.match(/name="(.*?)"/) || [])[1])
    .filter((d) => d)
  return {
    sourceFile,
    props,
    emits,
    name,
    slots,
    imported,
  }
}
