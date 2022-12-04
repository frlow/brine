import { Framework } from '../../utils/framework.js'
import path from 'path'

export * from '../../utils/kebab.js'
export * from '../../utils/framework.js'
export { analyze, AnalysisResult } from '../analysis/index.js'
export * from './indexFile.js'
export * from './metaFile.js'
export * from './typesFile.js'

export const parseFramework = (filePath: string): Framework => {
  const ext = path.parse(filePath).ext
  switch (ext) {
    case '.vue':
      return 'vue'
    case '.svelte':
      return 'svelte'
    case '.tsx':
      return 'react'
    default:
      throw `Cannot parse framework from ${ext}`
  }
}
