import { AnalyzeFileFunction } from './index.js'

export type AnalyzerTestCases = {
  name: { fileName: string; code: string }
  stringProp: string
  numberProp: string
  objectProp: string
  literalProp: string
  optionalProp: string
  multipleProps: string
  camelNameProp: string
  kebabNameProp: string | null
  exoticNameProp: string
  stringEmit: string
  numberEmit: string
  objectEmit: string
  literalEmit: string
  optionalEmit: string
  multipleEmits: string
  camelNameEmit: string
  kebabNameEmit: string
  exoticNameEmit: string
  noSlots: string
  defaultSlot: string
  namedSlot: string
  multipleNamedSlots: string
}
export const testAnalyzer = (
  analyze: AnalyzeFileFunction,
  testCases: Partial<AnalyzerTestCases>
) => {
  test('Name', async () => {
    const result = await analyze(testCases.name.fileName, testCases.name.code)
    expect(result.tag).toEqual('my-app')
    expect(result.name).toEqual('MyApp')
  })
  describe('Props', () => {
    test('String', async () => {
      const result = await analyze('dummy.js', testCases.stringProp)
      expect(result.props).toStrictEqual([
        { name: 'str', type: 'string', optional: false },
      ])
    })
    test('Number', async () => {
      const result = await analyze('dummy.js', testCases.numberProp)
      expect(result.props).toStrictEqual([
        { name: 'num', type: 'number', optional: false },
      ])
    })
    test('Object', async () => {
      const result = await analyze('dummy.js', testCases.objectProp)
      expect(result.props).toStrictEqual([
        { name: 'obj', type: '{val:string}', optional: false },
      ])
    })
    test('Literal', async () => {
      const result = await analyze('dummy.js', testCases.literalProp)
      expect(result.props).toStrictEqual([
        { name: 'literal', type: "'a'|'b'", optional: false },
      ])
    })
    test('Optional', async () => {
      const result = await analyze('dummy.js', testCases.optionalProp)
      expect(result.props).toStrictEqual([
        { name: 'optional', type: 'string', optional: true },
      ])
    })
    test('Multiple', async () => {
      const result = await analyze('dummy.js', testCases.multipleProps)
      expect(result.props).toStrictEqual([
        { name: 'a', type: 'string', optional: false },
        { name: 'b', type: 'number', optional: false },
      ])
    })
    test('Camel Name', async () => {
      const result = await analyze('dummy.js', testCases.camelNameProp)
      expect(result.props).toStrictEqual([
        { name: 'camel-name', type: 'string', optional: false },
      ])
    })
    if (testCases.kebabNameProp !== null)
      // Svelte cannot use kebab-cased props
      test('Kebab Name', async () => {
        const result = await analyze('dummy.js', testCases.kebabNameProp)
        expect(result.props).toStrictEqual([
          { name: 'kebab-name', type: 'string', optional: false },
        ])
      })
    test('Exotic Name', async () => {
      const result = await analyze('dummy.js', testCases.exoticNameProp)
      expect(result.props).toStrictEqual([
        { name: 'ex0t_ic', type: 'string', optional: false },
      ])
    })
  })
  describe('Emits', () => {
    test('String', async () => {
      const result = await analyze('dummy.js', testCases.stringEmit)
      expect(result.emits).toStrictEqual([
        { name: 'str', type: 'string', optional: false },
      ])
    })
    test('Number', async () => {
      const result = await analyze('dummy.js', testCases.numberEmit)
      expect(result.emits).toStrictEqual([
        { name: 'num', type: 'number', optional: false },
      ])
    })
    test('Object', async () => {
      const result = await analyze('dummy.js', testCases.objectEmit)
      expect(result.emits).toStrictEqual([
        { name: 'obj', type: '{val:string}', optional: false },
      ])
    })
    test('Literal', async () => {
      const result = await analyze('dummy.js', testCases.literalEmit)
      expect(result.emits).toStrictEqual([
        { name: 'literal', type: "'a'|'b'", optional: false },
      ])
    })
    test('Optional', async () => {
      const result = await analyze('dummy.js', testCases.optionalEmit)
      expect(result.emits).toStrictEqual([
        { name: 'optional', type: 'string', optional: true },
      ])
    })
    test('Multiple', async () => {
      const result = await analyze('dummy.js', testCases.multipleEmits)
      expect(result.emits).toStrictEqual([
        { name: 'a', type: 'string', optional: false },
        { name: 'b', type: 'number', optional: false },
      ])
    })
    test('Camel Name', async () => {
      const result = await analyze('dummy.js', testCases.camelNameEmit)
      expect(result.emits).toStrictEqual([
        { name: 'camel-name', type: 'string', optional: false },
      ])
    })
    test('Kebab Name', async () => {
      const result = await analyze('dummy.js', testCases.kebabNameEmit)
      expect(result.emits).toStrictEqual([
        { name: 'kebab-name', type: 'string', optional: false },
      ])
    })
    test('Exotic name', async () => {
      const result = await analyze('dummy.js', testCases.exoticNameEmit)
      expect(result.emits).toStrictEqual([
        { name: 'ex0t_ic', type: 'string', optional: false },
      ])
    })
  })
  describe('Slots', () => {
    test('No Slots', async () => {
      const result = await analyze('dummy.js', testCases.noSlots)
      expect(result.slots).toEqual(undefined)
    })
    test('Default Slot', async () => {
      const result = await analyze('dummy.js', testCases.defaultSlot)
      expect(result.slots).toEqual([])
    })
    test('Named Slot', async () => {
      const result = await analyze('dummy.js', testCases.namedSlot)
      expect(result.slots).toEqual(['named'])
    })
    test('Multiple Named Slot', async () => {
      const result = await analyze('dummy.js', testCases.multipleNamedSlots)
      expect(result.slots).toEqual(['a', 'b'])
    })
  })
}
