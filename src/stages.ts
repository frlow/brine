import fs from 'fs'
import { analyze } from './modules/analyze'
import { elementsModules, wrapperModules } from './activeModules'
import { writeFile } from './utils/writeFile'
import { wrapper } from './modules/wrapper'
import { build } from './modules/build'
import { bundle } from './modules/bundle'
import { generateDocsTypes, writeDocs } from './modules/docs'

export async function runStages(
  dist: string,
  source: string,
  prefix: string,
  external: string[],
  docs: boolean,
  clearDist: boolean
) {
  // Log start time
  const startTime = new Date().getTime()

  // Remove dist dir
  if (clearDist && fs.existsSync(dist)) fs.rmSync(dist, { recursive: true })

  // Analyze components
  const analyzerResult = await analyze(
    source,
    elementsModules,
    prefix,
    dist,
    writeFile
  )

  // Build components
  await build({
    dist,
    source,
    modules: elementsModules,
    external,
    prefix,
    analysisResults: analyzerResult.analysisResults,
  })

  // Build full bundle
  await bundle(dist)

  // Build wrappers
  await wrapper(
    dist,
    analyzerResult.analysisResults,
    wrapperModules.map((wm) => ({
      name: wm.fileType,
      wrapperFunction: wm.generateFunc,
    })),
    prefix,
    writeFile
  )
  // Build docs
  if (docs) {
    if (fs.lstatSync(source).isFile())
      throw '--no-docs must be used when targeting single file'
    await generateDocsTypes(analyzerResult.analysisResults, dist)
    await writeDocs(source, dist, {
      prefix,
      analysisResults: analyzerResult.analysisResults,
    })
  }

  // Log build time
  const endTime = new Date().getTime()
  console.log(`Build finished in: ${endTime - startTime} ms`)
}
