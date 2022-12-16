import fs from 'fs'
import path from 'path'

export type DummyStyle = '.dummy-style{}'
export const dummyStyle: DummyStyle = '.dummy-style{}'

export const injectCode = async (
  js: string,
  jsMap: string,
  code: string,
  target: string
) => {
  // @ts-ignore
  const StringReplaceSourceMap = (await import('string-replace-source-map'))
    .default
  const stringReplaceSourceMap = new StringReplaceSourceMap(js, jsMap)
  const beginIndex = js.split(target)[0].length
  const endIndex = beginIndex + target.length
  const escapedCode = code.replace(/"/g, '\\"')
  stringReplaceSourceMap.replace(beginIndex, endIndex, escapedCode)
  const replacedJs = js.replace(target, escapedCode)
  const replacedMap = JSON.stringify(
    await stringReplaceSourceMap.generateSourceMap()
  )
  return [replacedJs, replacedMap]
}

export const injectCss = async (
  js: string,
  jsMap: string,
  css?: string,
  dummyCss: string = dummyStyle
) => {
  if (!css) return [js, jsMap]
  const trimmedCss = css.replace(/\/\*.*?\*\//g, '').replace(/\n/g, '')
  return await injectCode(js, jsMap, trimmedCss, dummyCss)
}

export const groupJsMapCssFiles = (
  files: { path: string; text: string }[],
  hashFilter: RegExp = /-[A-Z,0-9]{8}/
) =>
  files
    .filter((file) => file.path.endsWith('.js'))
    .map((file) => {
      const js = file
      const map = files.find((d) => d.path === js.path + '.map')
      const jsParsed = path.parse(js.path)
      const deHashedJs = jsParsed.name.replace(hashFilter, '')
      const css = files.find((f) => {
        const parsed = path.parse(f.path)
        const deHashedName = parsed.name.replace(hashFilter, '')
        return (
          parsed.ext === '.css' &&
          deHashedName === deHashedJs &&
          jsParsed.dir === parsed.dir
        )
      })
      return { js, map, css }
    })

export const writeJsMapCssGroup = async (
  groupedFiles: ReturnType<typeof groupJsMapCssFiles>
) => {
  for (const fileGroup of groupedFiles) {
    fs.mkdirSync(path.parse(fileGroup.js.path).dir, { recursive: true })
    const [js, map] = fileGroup.css
      ? await injectCss(
          fileGroup.js.text,
          fileGroup.map.text,
          fileGroup.css.text
        )
      : [fileGroup.js.text, fileGroup.map.text]
    fs.writeFileSync(fileGroup.js.path, js)
    fs.writeFileSync(fileGroup.map.path, map)
  }
}
