import ts, {
  CallExpression,
  SourceFile,
  TypeLiteralNode,
  VariableDeclaration,
  VariableDeclarationList,
  VariableStatement,
} from 'typescript'
import path from 'path'
import { AnalyzeFileFunction, findProp, PropDefinition } from './common.js'
import SyntaxKind = ts.SyntaxKind
import ScriptTarget = ts.ScriptTarget
import { kebabize } from '../utils/string.js'

const getProps = (sourceFile: SourceFile): PropDefinition[] => {
  if (!sourceFile.statements) return []
  const defineProps = findProp(sourceFile, 'escapedText', 'defineProps')
    ?.parents[0]
  if (!defineProps) return []
  const props = (defineProps.typeArguments![0] as TypeLiteralNode).members
  return props.map((p: any) => ({
    name: p.name.getText(sourceFile),
    type: p.type!.getText(sourceFile),
    optional: !!p.questionToken,
  }))
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
    name: kebabize(p.parameters[0].type.literal.text),
    type: p.parameters[1]?.type.getText(sourceFile) || 'void',
    optional: !!p.type.types?.some(
      (t: any) => t.kind === SyntaxKind.UndefinedKeyword
    ),
  }))
}

export const analyzeVueFile: AnalyzeFileFunction = async (filePath, code) => {
  const { parse } = await import('vue/compiler-sfc')
  const { descriptor } = parse(code, {
    filename: filePath,
  })
  const sourceFile = ts.createSourceFile(
    filePath,
    descriptor.scriptSetup?.content || '',
    ScriptTarget.ESNext
  )
  const slots = descriptor.template?.content
    .match(/<component is="slot"(.*?)>/g)
    ?.map((d) => (d.match(/name="(.*?)"/) || [])[1])
    .filter((d) => d)
  const props = getProps(sourceFile)
  const emits = getEmits(sourceFile)
  const name = path.parse(filePath).name.split('.')[0]
  const tag = kebabize(name)
  return {
    props,
    emits,
    name,
    slots,
    tag,
  }
}
