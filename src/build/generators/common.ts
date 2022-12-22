import { Framework } from '../framework.js'
import path from 'path'
import type { AnalysisResult } from '../analysis/index.js'
import fs from 'fs'
import { generateMetaFile } from 'brinejs'

export { AnalysisResult }
export { camelize, kebabize } from '../../common.js'
export * from '../framework.js'
export { analyze } from '../analysis/index.js'

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
