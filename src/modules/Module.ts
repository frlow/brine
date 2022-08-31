import { Plugin } from 'esbuild'
import { AnalysisResult, AnalyzeFileFunction } from './analyze'
import { GenerateWrapperFunction } from './wrapper'
import { Dictionary } from '../utils/types'

export type PluginOptions = {
  dist: string
  prefix: string
  analysisResults: AnalysisResult[]
}

export type ElementsModule = {
  name: string
  plugin: (options: PluginOptions) => Plugin
  analyzeFunc: AnalyzeFileFunction
  findMatchingFiles: (dir: string) => string[]
}

export type GenericComponent = {
  name: string
  slot?: string
  props?: Dictionary<any>
  emits?: Dictionary<any>
  children?: GenericComponent[]
}
export type BuildTestAppFunc = (component: GenericComponent) => Promise<string>
export type WrapperModule = {
  name: string
  fileType: string
  generateFunc: GenerateWrapperFunction
  buildTestApp: BuildTestAppFunc
}
export type TestAppConfig = {
  [i: string]: GenericComponent
}
export const getImportsFromComponent = (
  component: GenericComponent
): Dictionary<string> => {
  let ret = { [component.name]: component.name } as Dictionary<string>
  component.children?.forEach((child) => {
    ret = { ...ret, ...getImportsFromComponent(child) }
  })
  return ret
}
