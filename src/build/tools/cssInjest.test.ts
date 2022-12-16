import { injectCss } from './cssInject'
import { jest } from '@jest/globals'

describe('inject css', () => {
  test('', async () => {
    const source = `// demo.ts
var style = ".dummy-style{}";
console.log(style);
//# sourceMappingURL=demo.js.map`
    const map = `{
  "version": 3,
  "sources": ["demo.ts"],
  "sourcesContent": ["const style = '.dummy-style{}'\\nconsole.log(style)\\n"],
  "mappings": ";AAAA,IAAM,QAAQ;AACd,QAAQ,IAAI,KAAK;",
  "names": []
}
`
    const code = `.demo{content: ""}`
    const [replacedJs] = await injectCss(source, map, code)
    console.log = jest.fn()
    expect(() => eval(replacedJs)).not.toThrowError('Unexpected string')
    expect(console.log).toHaveBeenCalledWith(code)
  })
})
