import { analyzeJsxFile } from './jsx.js'
import { analyzeVueFile } from './vue.js'
import { analyzeSvelteFile } from './svelte.js'
import type { Framework } from '../../utils/framework.js'

export * from '../../utils/kebab.js'
export * from '../../utils/findProp.js'
export * from '../../utils/framework.js'

export type PropDefinition = {
  name: string
  type: string
  optional?: boolean
}

export type AnalysisResult = {
  props: PropDefinition[]
  emits: PropDefinition[]
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
