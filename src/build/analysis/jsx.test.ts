import { testAnalyzer } from './common.test.js'
import { analyzeJsxFile } from './jsx.js'

describe('jsx', () => {
  testAnalyzer(analyzeJsxFile, {
    tagName: { fileName: 'myApp.tsx', code: `export default ()=>{}` },
    stringProp: `export default (args: {str: string})=>{}`,
    numberProp: `export default (args: {num: number})=>{}`,
    objectProp: `export default (args: {obj: {val:string}})=>{}`,
    literalProp: `export default (args: {literal: 'a'|'b'})=>{}`,
    optionalProp: `export default (args: {optional?: string})=>{}`,
    multipleProps: `export default (args: {a: string, b: number})=>{}`,
    camelName: `export default (args: {camelName: string})=>{}`,
    kebabName: `export default (args: {"kebab-name": string})=>{}`,
    exoticName: `export default (args: {ex0t_ic: string})=>{}`,
  })
})
