import { analyzeJsxFile } from './jsx.js'

export const appendJsxProps = async (filePath: string, source: string) => {
  const ar = await analyzeJsxFile(filePath, source)
  return source.includes('export default function (')
    ? `${source.replace(
        'export default function (',
        'export default function __component ('
      )}
__component.__props = [${ar.props.map((p) => `'${p.name}'`).join(',')}]
__component.__emits = [${ar.emits.map((e) => `'${e.name}'`).join(',')}]`
    : source
}
