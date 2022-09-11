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
export type GenerateWrapperFunction = (
  analysisResult: AnalysisResult,
  prefix: string,
  autoImport: string[]
) => Promise<WrapperFile>

async function generateWrappers(
  generators: { name: string; wrapperFunction: GenerateWrapperFunction }[],
  analysisResults: AnalysisResult[],
  outdir: string,
  prefix: string,
  writeFile: (filePath: string, contents: string) => void,
  autoImport: boolean
) {
  const wrapperRootDir = path.join(
    outdir,
    autoImport ? 'wrapper' : 'lite-wrapper'
  )
  for (const generator of generators) {
    const index: string[] = []
    const dTs: string[] = []
    for (const ar of analysisResults) {
      const wrapperDir = path.join(wrapperRootDir, generator.name)
      const autoImports: string[] = []
      if (autoImport) {
        const target = glob.sync(`${outdir}/elements/**/${ar.name}.*`)[0]
        if (!target) throw 'Could not find autoImport target!'
        const relative = path.relative(wrapperDir, target).replace('.js', '')
        autoImports.push(relative)
      }
      const wrapper = await generator
        .wrapperFunction(ar, prefix, autoImports)
        .then((r) => ({
          ...r,
          name: ar.name,
        }))

      wrapper.code.forEach((code) =>
        writeFile(
          path.join(wrapperDir, `${ar.name}.${code.fileType}`),
          code.content
        )
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
  await generateWrappers(
    generators,
    analysisResults,
    outdir,
    prefix,
    writeFile,
    true
  )
  await generateWrappers(
    generators,
    analysisResults,
    outdir,
    prefix,
    writeFile,
    false
  )
}
