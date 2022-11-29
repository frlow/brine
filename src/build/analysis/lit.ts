import fs from 'fs'
import path from 'path'
import ts, { createSourceFile, SourceFile } from 'typescript'
import { AnalyzeFileFunction, getComponentName, PropDefinition } from './common'
import SyntaxKind = ts.SyntaxKind
import ScriptTarget = ts.ScriptTarget
import { kebabize } from '../utils/string'

const getEmits = (classSource: any, sourceFile: SourceFile) => {
  const eventDispatcher = classSource.members.find(
    (m: any) =>
      m.initializer?.expression?.escapedText === 'createLitEventDispatcher'
  )
  if (!eventDispatcher) return []
  const args = eventDispatcher.initializer.typeArguments![0] as any
  const emits = args?.members.map((p: any) => ({
    name: p.name!.getText(sourceFile),
    type: (p as any).type.getText(sourceFile),
    optional: !!p.questionToken,
  }))
  return emits
}

export const analyzeLitFile: AnalyzeFileFunction = async (filePath) => {
  const text = fs.readFileSync(filePath.split('?')[0], 'utf8')
  const sourceFile: any = createSourceFile(filePath, text, ScriptTarget.ESNext)
  const classSource = sourceFile.statements.find(
    (d: any) => d.kind === SyntaxKind.ClassDeclaration
  )
  const props: PropDefinition[] =
    classSource.members
      .filter(
        (m: any) =>
          m.kind === SyntaxKind.PropertyDeclaration &&
          m.modifiers?.some(
            (mod: any) => mod.expression.expression.escapedText === 'property'
          )
      )
      .map((p: any) => ({
        name: p.name.escapedText,
        type: p.type.getText(sourceFile),
        optional: !!p.questionToken,
      })) || []

  const emits: PropDefinition[] = getEmits(classSource, sourceFile)
  const slots: string[] | undefined = text
    .match(/<slot(.*?)>/g)
    ?.map((d) => (d.match(/name="(.*?)"/) || [])[1])
    .filter((d) => d)
  const name = getComponentName(path.parse(filePath).name)
  const tag = kebabize(name)
  return {
    props,
    emits,
    slots,
    name,
    tag,
  }
}
