import ts, { SyntaxKind } from 'typescript'
import { AnalysisResult } from '../analyze'

export const shouldSendAsString = (
  typeNode: ts.TypeNode,
  analysisResult: AnalysisResult
): boolean => {
  if (typeNode.kind === SyntaxKind.UnionType) {
    const typeKinds = (typeNode as any).types.map((t: any) => t.kind)
    return typeKinds.every((tk: number) => tk === SyntaxKind.LiteralType)
  }
  const text = typeNode.getText(analysisResult.sourceFile)
  return text === 'string'
}
