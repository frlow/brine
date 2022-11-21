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
}

export type AnalyzeFileFunction = (filePath: string) => Promise<AnalysisResult>
