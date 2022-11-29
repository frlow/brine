import { AnalyzeFileFunction, Framework } from './common'
import { analyzeJsxFile } from './jsx'
import { analyzeVueFile } from './vue'
import { analyzeSvelteFile } from './svelte'

export * from './indexFile'
export * from './metaFile'
export * from './typesFile'

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
