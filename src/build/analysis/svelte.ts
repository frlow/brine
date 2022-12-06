import ts, {
  CallExpression,
  SourceFile,
  TypeLiteralNode,
  VariableDeclarationList,
  VariableStatement,
} from 'typescript'
import path from 'path'
import { AnalyzeFileFunction, PropDefinition, kebabize } from './index.js'
import SyntaxKind = ts.SyntaxKind
import ScriptTarget = ts.ScriptTarget

const getProps = (sourceFile: SourceFile): PropDefinition[] => {
  if (!sourceFile.statements) return []
  const exports = sourceFile.statements.filter((d) =>
    d.modifiers?.some((m) => m.kind === SyntaxKind.ExportKeyword)
  )
  const props = exports.map(
    (ex) =>
      ex
        .getChildren(sourceFile)
        .find(
          (c) => c.kind === SyntaxKind.VariableDeclarationList
        ) as VariableDeclarationList
  )
  const variables = props.map((pr) => {
    return pr.declarations[0]
  })
  return variables.map((v) => ({
    name: kebabize(v.name.getText(sourceFile)),
    type: v.type!.getText(sourceFile),
    optional: !!v.initializer,
  }))
}

function getEmits(sourceFile: ts.SourceFile): PropDefinition[] {
  if (!sourceFile.statements) return []
  const variableStatements = sourceFile.statements.filter(
    (d) => d.kind === SyntaxKind.VariableStatement
  ) as VariableStatement[]
  const callExpressions = variableStatements.flatMap((vs) =>
    vs.declarationList.declarations.flatMap((d) =>
      d
        .getChildren(sourceFile)
        .filter((c) => c.kind === SyntaxKind.CallExpression)
    )
  ) as CallExpression[]
  const dispatch = callExpressions.find(
    (ce) => ce.expression.getText(sourceFile) === 'createEventDispatcher'
  ) as CallExpression
  if (!dispatch) return []
  const args = dispatch.typeArguments![0] as TypeLiteralNode
  const emits = args?.members.map((p) => ({
    name: kebabize(p.name!.getText(sourceFile).replace(/\"/g, '')),
    type: (p as any).type.getText(sourceFile),
  }))
  return emits
}

export const analyzeSvelteFile: AnalyzeFileFunction = async (
  filePath,
  code
) => {
  let sourceFile: SourceFile = {} as SourceFile
  let slots: string[] | undefined = undefined
  const { preprocess } = await import('svelte/compiler')
  await preprocess(code, {
    markup: ({ content }) => {
      slots = content
        .match(/<svelte:element this="slot"(.*?)>/g)
        ?.map((d) => (d.match(/name="(.*?)"/) || [])[1])
        .filter((d) => d)
    },
    script: ({ content }) => {
      sourceFile = ts.createSourceFile(filePath, content, ScriptTarget.ESNext)
    },
  })
  const props = getProps(sourceFile)
  const emits = getEmits(sourceFile)
  const name = path.parse(filePath).name
  const tag = kebabize(name)
  return {
    props,
    emits,
    name,
    slots,
    tag,
  }
}
