import { analyzeJsxFile } from './jsx.js'
import { analyzeVueFile } from './vue.js'
import { analyzeSvelteFile } from './svelte.js'
import type { Framework } from '../framework.js'

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
) =>
  ((
    {
      react: analyzeJsxFile,
      vue: analyzeVueFile,
      svelte: analyzeSvelteFile,
    } as { [i: string]: AnalyzeFileFunction }
  )[framework](file, code))
