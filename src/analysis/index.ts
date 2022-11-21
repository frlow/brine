import { AnalysisResult, AnalyzeFileFunction, Framework } from './common'
import { analyzeJsxFile } from './jsx'
import { analyzeVueFile } from './vue'
import { analyzeSvelteFile } from './svelte'
import { kebabize } from '../utils/string'

export const analyze = async (file: string, framework: Framework) =>
  ((
    {
      react: analyzeJsxFile,
      vue: analyzeVueFile,
      svelte: analyzeSvelteFile,
    } as { [i: string]: AnalyzeFileFunction }
  )[framework](file))

export const getAttributes = (ar: AnalysisResult): { [i: string]: boolean } => {
  return ar.props.reduce((acc, cur) => {
    acc[cur.name] = cur.type === 'string'
    return acc
  }, {} as { [i: string]: boolean })
}

export const getEmits = (ar: AnalysisResult): string[] => {
  return ar.emits.map((e) => kebabize(e.name))
}
