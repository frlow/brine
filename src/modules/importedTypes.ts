import {AnalysisResult} from "./analyze";
import {SourceFile, SyntaxKind} from 'typescript'
import path from "path";
import fs from "fs";

export const getTypeImports = (sourceFile: any): string[] => {
  const typeImports = sourceFile?.statements?.filter((d: any) => d?.kind === SyntaxKind.ImportDeclaration && d?.importClause?.isTypeOnly) || []
  if (typeImports.length === 0) return []
  const filePath = path.resolve(path.dirname(sourceFile.fileName))
  return typeImports.flatMap((ti: any) => ti?.importClause?.namedBindings?.elements?.map((e: any) => e?.name?.text)) || []
}

export const importTypes = async (results: AnalysisResult[], dist: string) => {
  const files: { [i: string]: {} } = {}
  results.forEach(r => {
    const typeImports = r.sourceFile?.statements?.filter((d: any) => d?.kind === SyntaxKind.ImportDeclaration && d?.importClause?.isTypeOnly) || []
    if (!r.sourceFile?.fileName) return
    const dir = path.resolve(path.dirname(r.sourceFile.fileName))
    if (typeImports.length === 0) return
    typeImports.forEach((ti: any) => {
      const file = ti?.moduleSpecifier?.text
      const fullPath = path.join(dir, file)
      if (fullPath)
        files[fullPath] = {}
    })
  })
  const code = Object.keys(files).map(file => fs.readFileSync(file + '.ts', 'utf8')).join('\n')
  if (!fs.existsSync(path.join(dist, 'wrapper'))) fs.mkdirSync(path.join(dist, 'wrapper'), {recursive: true})
  fs.writeFileSync(path.join(dist, 'wrapper', 'types.ts'), code, 'utf8')
}