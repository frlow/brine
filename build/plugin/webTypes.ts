import { FilePluginOptions } from './common'
import { analyze } from '../analysis'
import { AnalysisResult } from '../analysis/common'
import type { Plugin } from 'esbuild'
import fs from 'fs'
import path from 'path'

export const generateWebTypes = (ar: AnalysisResult[], prefix: string) => {
  return {}
}
export const generateVsCodeTypes = (ar: AnalysisResult[], prefix: string) => {
  return {}
}

export const generateTypes = async (
  files: FilePluginOptions[],
  prefix: string
) => {
  const results = await Promise.all(
    files.map((file) => analyze(file.path, file.framework))
  )
  const brine = results.map((br) => ({
    ...br,
    tag: `${prefix}-${br.tag}`,
  }))
  const webTypes = generateWebTypes(results, prefix)
  const vsCode = generateVsCodeTypes(results, prefix)
  return {
    prefix,
    brine,
    webTypes,
    vsCode,
  }
}

export const typesDocsPlugin = (
  files: FilePluginOptions[],
  prefix: string
): Plugin => ({
  name: 'types-docs',
  setup(build) {
    build.onEnd(async (result) => {
      const types = await generateTypes(files, prefix)

      fs.writeFileSync(
        path.join(build.initialOptions.outdir, 'brineTypes.json'),
        JSON.stringify(types.brine, null, 2),
        'utf8'
      )
      debugger
    })
  },
})
