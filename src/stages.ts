import fs from 'fs'
import { analyze } from './modules/analyze'
import { elementsModules, wrapperModules } from './activeModules'
import { writeFile } from './utils/writeFile'
import { importTypes } from './modules/importedTypes'
import { wrapper } from './modules/wrapper'
import { build } from './modules/build'
import { bundle } from './modules/bundle'

export async function runStages(
  dist: string,
  source: string,
  prefix: string,
  external: string[],
  autoImport: boolean
) {
  const startTime = new Date().getTime()
  if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true })
  const analyzerResult = await analyze(
    source,
    elementsModules,
    prefix,
    dist,
    writeFile
  )
  await importTypes(analyzerResult.analysisResults, dist)
  await wrapper(
    dist,
    analyzerResult.analysisResults,
    wrapperModules.map((wm) => ({
      name: wm.fileType,
      wrapperFunction: wm.generateFunc,
    })),
    prefix,
    false,
    writeFile
  )
  await build({
    dist,
    source,
    modules: elementsModules,
    external,
    prefix,
    analysisResults: analyzerResult.analysisResults,
  })
  await bundle(dist)
  if (autoImport) {
    await wrapper(
      dist,
      analyzerResult.analysisResults,
      wrapperModules.map((wm) => ({
        name: wm.fileType,
        wrapperFunction: wm.generateFunc,
      })),
      prefix,
      true,
      writeFile
    )
  }

  const endTime = new Date().getTime()
  console.log(`Build finished in: ${endTime - startTime} ms`)
}
