import path from 'path'
import { AnalysisResult } from './analyze'
import { getFileMap } from '../utils/findFiles'
import { WriteFileFunc } from '../utils/writeFile'

export type WrapperFile = {
  code: {
    content: string
    fileType: string
  }[]
  exportCodeLine: string
  declarationLine: string
}
export type GenerateWrapperFunction = (
  analysisResult: AnalysisResult,
  prefix: string,
  importMap?: { [i: string]: string[] }
) => Promise<WrapperFile>

export const wrapper = async (
  outdir: string,
  analysisResults: AnalysisResult[],
  generators: { name: string; wrapperFunction: GenerateWrapperFunction }[],
  prefix: string,
  autoImport: boolean,
  writeFile: WriteFileFunc
) => {
  let importMap: { [i: string]: string[] } | undefined = undefined
  if (autoImport) {
    const fileMap = getFileMap(outdir)
    const getImports = (name: string, list: string[] = []): string[] => {
      const current = analysisResults.find((ar) => ar.name === name)!
      const currentMap = fileMap[current.name]
      if (list.includes(currentMap)) return list
      list.push(currentMap)
      for (const i of current.imported) {
        getImports(i, list)
      }
      return list
    }
    importMap = analysisResults.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.name]: getImports(cur.name),
      }),
      {} as { [i: string]: string[] }
    )
  }
  for (const generator of generators) {
    const index: string[] = []
    const dTs: string[] = []
    for (const ar of analysisResults) {
      const wrapper = await generator
        .wrapperFunction(ar, prefix, importMap)
        .then((r) => ({
          ...r,
          name: ar.name,
        }))
      wrapper.code.forEach((code) =>
        writeFile(
          path.join(
            outdir,
            'wrapper',
            generator.name,
            `${ar.name}.${code.fileType}`
          ),
          code.content
        )
      )

      index.push(wrapper.exportCodeLine)
      dTs.push(wrapper.declarationLine)
    }
    writeFile(
      path.join(outdir, 'wrapper', generator.name, 'index.js'),
      index.join('\n')
    )
    writeFile(
      path.join(outdir, 'wrapper', generator.name, 'index.d.ts'),
      dTs.join('\n')
    )
  }
}
