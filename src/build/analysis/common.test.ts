import { AnalyzeFileFunction } from './index.js'

export type AnalyzerTestCases = {
  tagName: { fileName: string; code: string }
  stringProp: string
  numberProp: string
  objectProp: string
  literalProp: string
  optionalProp: string
  multipleProps: string
}
export const testAnalyzer = (
  analyze: AnalyzeFileFunction,
  testCases: AnalyzerTestCases
) => {
  describe('FilePath', () => {
    test('Tag name', async () => {
      const result = await analyze(
        testCases.tagName.fileName,
        testCases.tagName.code
      )
      expect(result.tag).toEqual('my-app')
    })
  })
  describe('Props', () => {
    test('String Prop', async () => {
      const result = await analyze('dummy.js', testCases.stringProp)
      expect(result.props).toStrictEqual([
        { name: 'str', type: 'string', optional: false },
      ])
    })
    test('Number Prop', async () => {
      const result = await analyze('dummy.js', testCases.numberProp)
      expect(result.props).toStrictEqual([
        { name: 'num', type: 'number', optional: false },
      ])
    })
    test('Object Prop', async () => {
      const result = await analyze('dummy.js', testCases.objectProp)
      expect(result.props).toStrictEqual([
        { name: 'obj', type: '{val:string}', optional: false },
      ])
    })
    test('Literal Prop', async () => {
      const result = await analyze('dummy.js', testCases.literalProp)
      expect(result.props).toStrictEqual([
        { name: 'literal', type: "'a'|'b'", optional: false },
      ])
    })
    test('Optional Prop', async () => {
      const result = await analyze('dummy.js', testCases.optionalProp)
      expect(result.props).toStrictEqual([
        { name: 'optional', type: 'string', optional: true },
      ])
    })
    test('Multiple Props', async () => {
      const result = await analyze('dummy.js', testCases.multipleProps)
      expect(result.props).toStrictEqual([
        { name: 'a', type: 'string', optional: false },
        { name: 'b', type: 'number', optional: false },
      ])
    })
  })
}
