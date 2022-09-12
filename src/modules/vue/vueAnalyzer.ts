import { parse } from 'vue/compiler-sfc'
import fs from 'fs'
import ts, {
  CallExpression,
  ScriptTarget,
  SourceFile,
  SyntaxKind,
  TypeLiteralNode,
  VariableDeclaration,
  VariableDeclarationList,
  VariableStatement,
} from 'typescript'
import path from 'path'
import { AnalyzeFileFunction, PropDefinition } from '../analyze'

const getProps = (sourceFile: SourceFile): PropDefinition[] => {
  if (!sourceFile.statements) return []
  const variableStatements = sourceFile.statements.filter(
    (d) => d.kind === SyntaxKind.VariableStatement
  ) as VariableStatement[]
  const variableDeclarationLists = variableStatements.flatMap((v) =>
    v
      .getChildren(sourceFile)
      .filter((ch) => ch.kind === SyntaxKind.VariableDeclarationList)
  ) as VariableDeclarationList[]
  const variableDeclarations = variableDeclarationLists.flatMap(
    (vdl) => vdl.declarations
  ) as VariableDeclaration[]
  const initializers = variableDeclarations.map(
    (vd) => vd.initializer
  ) as CallExpression[]
  const defineProps = initializers.find(
    (i) => i.expression?.getText(sourceFile) === 'defineProps'
  )
  if (!defineProps) return []
  const props = (defineProps.typeArguments![0] as TypeLiteralNode).members
  return props.map((p: any) => ({
    name: p.name.getText(sourceFile),
    type: p.type!,
    optional: !!p.questionToken,
  }))
}

const getImported = (sourceFile: SourceFile): string[] => {
  return (
    (sourceFile as any)?.statements
      ?.filter(
        (s: any) =>
          s.kind === SyntaxKind.ImportDeclaration &&
          s.moduleSpecifier?.text?.startsWith('~vue/')
      )
      ?.map((s: any) => s?.importClause?.name?.text) || []
  )
}

const getEmits = (sourceFile: SourceFile): PropDefinition[] => {
  if (!sourceFile.statements) return []
  const variableStatements = sourceFile.statements.filter(
    (d) => d.kind === SyntaxKind.VariableStatement
  ) as VariableStatement[]
  const variableDeclarationLists = variableStatements.flatMap((v) =>
    v
      .getChildren(sourceFile)
      .filter((ch) => ch.kind === SyntaxKind.VariableDeclarationList)
  ) as VariableDeclarationList[]
  const variableDeclarations = variableDeclarationLists.flatMap(
    (vdl) => vdl.declarations
  ) as VariableDeclaration[]
  const initializers = variableDeclarations.map(
    (vd) => vd.initializer
  ) as CallExpression[]
  const defineEmits = initializers.find(
    (i) => i.expression?.getText(sourceFile) === 'defineEmits'
  )
  if (!defineEmits) return []
  const emits = (defineEmits.typeArguments![0] as TypeLiteralNode).members
  return emits.map((p: any) => ({
    name: p.parameters[0].type.literal.text,
    type: p.parameters[1]
      ? p.parameters[1].type
      : {
          kind: SyntaxKind.VoidKeyword,
          getText: () => 'void',
        },
    optional: !!p.type.types?.some(
      (t: any) => t.kind === SyntaxKind.UndefinedKeyword
    ),
  }))
}

export const analyzeVueFile: AnalyzeFileFunction = async (filePath) => {
  const source = fs.readFileSync(filePath, 'utf8')
  const { descriptor } = parse(source, {
    filename: filePath,
  })
  const sourceFile = ts.createSourceFile(
    filePath,
    descriptor.scriptSetup?.content || '',
    ScriptTarget.ESNext
  )
  const slots = descriptor.template?.content
    .match(/<slot(.*?)>/g)
    ?.map((d) => (d.match(/name="(.*?)"/) || [])[1])
    .filter((d) => d)
  const props = getProps(sourceFile)
  const emits = getEmits(sourceFile)
  const imported = getImported(sourceFile)
  return {
    sourceFile,
    props,
    emits,
    name: path.parse(filePath).name,
    slots,
    imported,
  }
}
