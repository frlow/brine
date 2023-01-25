import { analyzeJsxFile } from './jsx'

export const appendJsxProps = async (filePath: string, source: string) => {
  const ar = await analyzeJsxFile(filePath, source)
  return `${source}
export const __props = [${ar.props.map((p) => `'${p.name}'`).join(',')}]
export const __emits = [${ar.emits.map((e) => `'${e.name}'`).join(',')}]`
}
