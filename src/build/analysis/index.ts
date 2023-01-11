import { analyzeJsxFile } from './jsx.js'
import { analyzeVueFile } from './vue.js'
import { analyzeSvelteFile } from './svelte.js'
import type { Framework } from '../framework.js'
import { Simulate } from 'react-dom/test-utils'
import canPlay = Simulate.canPlay

export { kebabize, camelize } from '../../common.js'
export * from '../framework.js'

export type PropDefinition = {
  name: string
  type: string
  optional?: boolean
}

export type AnalysisResult = {
  props: PropDefinition[]
  emits: Pick<PropDefinition, 'type' | 'name'>[]
  slots: string[] | undefined
  name: string
  tag: string
}

export type AnalyzeFileFunction = (
  filePath: string,
  code: string
) => Promise<AnalysisResult>

export const analyze = async (
  file: string,
  code: string,
  framework: Framework
) => {
  switch (framework) {
    case 'solid':
    case 'react':
      return analyzeJsxFile(file, code)
    case 'vue':
      return analyzeVueFile(file, code)
    case 'svelte':
      return analyzeSvelteFile(file, code)
    default:
      throw `${framework} not supported!`
  }
}
