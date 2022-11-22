import path from 'path'

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

export const getComponentName = (filePath: string) => {
  return path.parse(filePath).name.split('.')[0]
}

export const findProp = (
  obj: any,
  key: string,
  value: any,
  parents: any[] = []
): any => {
  if (parents.includes(obj)) return null
  if (obj && obj[key] === value) return { obj, parents }
  const childProps =
    (obj &&
      Object.values(obj).flatMap((val) =>
        findProp(val, key, value, [obj, ...parents])
      )) ||
    []
  return childProps.find((d: any) => !!d)
}

export type Framework = 'react' | 'vue' | 'svelte'
