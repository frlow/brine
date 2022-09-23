import path from 'path'
import { AnalysisResult } from './analyze'
import { WriteFileFunc } from '../utils/writeFile'
import glob from 'glob'

export type WrapperFile = {
  code: {
    content: string
    fileType: string
  }[]
  exportCodeLine: string
  declarationLine: string
}

export type ImportMode = 'auto' | 'lite' | 'lazy'

export type GenerateWrapperFunction = (
  analysisResult: AnalysisResult,
  prefix: string,
  importMode: ImportMode,
  importFile: string
) => Promise<WrapperFile>

async function writeWrapper(
  wrapperFunction: GenerateWrapperFunction,
  ar: AnalysisResult,
  prefix: string,
  importFile: string,
  writeFile: WriteFileFunc,
  wrapperDir: string,
  importMode: ImportMode
) {
  const wrapper = await wrapperFunction(
    ar,
    prefix,
    importMode,
    importFile
  ).then((r) => ({
    ...r,
    name: ar.name,
  }))

  const fileNameFix =
    importMode === 'auto' ? '' : importMode === 'lite' ? '.lite' : '.lazy'
  wrapper.code.forEach((code) =>
    writeFile(
      path.join(wrapperDir, `${ar.name}${fileNameFix}.${code.fileType}`),
      code.content
    )
  )
  return wrapper
}

async function generateWrappers(
  generators: { name: string; wrapperFunction: GenerateWrapperFunction }[],
  analysisResults: AnalysisResult[],
  outdir: string,
  prefix: string,
  writeFile: (filePath: string, contents: string) => void
) {
  const wrapperRootDir = path.join(outdir, 'wrapper')
  for (const generator of generators) {
    const index: string[] = []
    const dTs: string[] = []
    for (const ar of analysisResults) {
      const wrapperDir = path.join(wrapperRootDir, generator.name)
      const target = glob.sync(`${outdir}/module/**/${ar.name}.*`)[0]
      if (!target) throw 'Could not find autoImport target!'
      const importFile = path.relative(wrapperDir, target).replace('.js', '')
      const wrapper = await writeWrapper(
        generator.wrapperFunction,
        ar,
        prefix,
        importFile,
        writeFile,
        wrapperDir,
        'auto'
      )
      await writeWrapper(
        generator.wrapperFunction,
        ar,
        prefix,
        importFile,
        writeFile,
        wrapperDir,
        'lite'
      )
      await writeWrapper(
        generator.wrapperFunction,
        ar,
        prefix,
        importFile,
        writeFile,
        wrapperDir,
        'lazy'
      )

      index.push(wrapper.exportCodeLine)
      dTs.push(wrapper.declarationLine)
    }
    writeFile(
      path.join(wrapperRootDir, generator.name, 'index.js'),
      index.join('\n')
    )
    writeFile(
      path.join(wrapperRootDir, generator.name, 'index.d.ts'),
      dTs.join('\n')
    )
  }
}

export const wrapper = async (
  outdir: string,
  analysisResults: AnalysisResult[],
  generators: { name: string; wrapperFunction: GenerateWrapperFunction }[],
  prefix: string,
  writeFile: WriteFileFunc
) => {
  await generateWrappers(generators, analysisResults, outdir, prefix, writeFile)
}
