import type { Plugin } from 'esbuild'
import fs from 'fs'
import path from 'path'

export const injectCss = async (
  js: string,
  jsMap: string,
  css: string,
  dummyCss: string = dummyStyle
) => {
  // @ts-ignore
  const StringReplaceSourceMap = (await import('string-replace-source-map'))
    .default
  const stringReplaceSourceMap = new StringReplaceSourceMap(js, jsMap)
  const beginIndex = js.split(dummyCss)[0].length
  const endIndex = beginIndex + dummyCss.length
  const trimmedCss = css.replace(/\/\*.*?\*\//g, '').replace(/\n/g, '')
  stringReplaceSourceMap.replace(beginIndex, endIndex, trimmedCss)
  const replacedJs = js.replace(dummyCss, trimmedCss)
  const replacedMap = JSON.stringify(
    await stringReplaceSourceMap.generateSourceMap()
  )
  return { replacedJs, replacedMap }
}

export const dummyStyle = '.dummy-style{}'
export const injectCssPlugin = (dummyCss?: string): Plugin => ({
  name: 'inject-css',
  setup(build) {
    if (build.initialOptions.write !== false)
      throw "write must be set to 'false'"
    build.onEnd(async (result) => {
      for (const file of result.outputFiles.filter((f) =>
        f.path.endsWith('.js')
      )) {
        const parsed = path.parse(file.path)
        fs.mkdirSync(parsed.dir, { recursive: true })
        const jsMap = result.outputFiles.find(
          (d) => d.path === `${file.path}.map`
        )
        const css = result.outputFiles.find((d) => {
          const regex = new RegExp(
            `${path
              .join(parsed.dir, parsed.name)
              .replace('.', '.')
              .replace(/-[A-Z,0-9]{8}/, '')}(-[A-Z,0-9]{8})?\.css$`
          )
          return regex.test(d.path)
        })
        if (css) {
          const { replacedJs, replacedMap } = await injectCss(
            file.text,
            jsMap.text,
            css.text,
            dummyCss
          )
          fs.writeFileSync(file.path, replacedJs, 'utf8')
          fs.writeFileSync(jsMap.path, replacedMap, 'utf8')
        } else {
          fs.writeFileSync(file.path, file.contents, 'utf8')
          fs.writeFileSync(jsMap.path, jsMap.contents, 'utf8')
        }
      }
    })
  },
})
