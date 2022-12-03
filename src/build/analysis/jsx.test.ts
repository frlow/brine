import { analyzeJsxFile } from './jsx.js'
import { testProps } from './common.test.js'

describe('jsx', () => {
  test('demo', async () => {
    const code = `export default ({
    num,
    str = "default",
    obj,
    camelName,
    "kebab-name",
    underscore_name
    }: {
  num: number
  str: string
  obj?: { val: string }
  camelName: string
  "kebab-name": string
  underscore_name: string
}) => {}`
    const result = await analyzeJsxFile('DummyComponent.tsx', code)
    testProps(result)
  })
})
