import { AnalyzeFileFunction, Framework } from './common.js'
import { analyzeJsxFile } from './jsx.js'
import { analyzeVueFile } from './vue.js'
import { analyzeSvelteFile } from './svelte.js'

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
