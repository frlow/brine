import { AnalyzeFileFunction, PropDefinition } from '../analyze'
import fs from 'fs'
import ts, { ScriptTarget, SourceFile } from 'typescript'
import { getComponentName } from '../../utils/findFiles'
import path from 'path'

export const analyzeLitFile: AnalyzeFileFunction = async (filePath) => {
  const text = fs.readFileSync(filePath.split('?')[0], 'utf8')
  const sourceFile: any = ts.createSourceFile(
    filePath,
    text,
    ScriptTarget.ESNext
  )
  const props: PropDefinition[] = []
  const emits: PropDefinition[] = []
  const slots: string[] | undefined = undefined
  const name = getComponentName(path.parse(filePath).name)
  const imported: string[] = []
  return {
    sourceFile,
    props,
    emits,
    slots,
    name,
    imported,
  }
}
