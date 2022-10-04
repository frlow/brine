import { elementsModules } from '../src/activeModules'
import { AnalysisResult, analyze, PropDefinition } from '../src/modules/analyze'
import path from 'path'
import { writeFile } from '../src/utils/writeFile'

const capitalize = (str: string) =>
  str.substring(0, 1).toUpperCase() + str.substring(1)

type StringPropDefinition = Omit<PropDefinition, 'type'> & { type: string }
type Result = Omit<
  Omit<
    Omit<AnalysisResult, 'props'> & {
      props: StringPropDefinition[]
    },
    'emits'
  > & { emits: StringPropDefinition[] },
  'sourceFile'
>

describe('Analyzer', () => {
  let results: Result[]
  const findItem = (name: string) =>
    results.find((r) => r.name.toLowerCase() === name.toLowerCase())
  beforeAll(async () => {
    const analyzerResult = await analyze(
      path.join('test', 'example'),
      elementsModules,
      'ex',
      path.join('test', 'dist'),
      writeFile
    )
    results = analyzerResult.analysisResults.map((ar) => ({
      name: ar.name,
      imported: ar.imported,
      slots: ar.slots,
      props: ar.props?.map((p) => ({
        ...p,
        type: p.type.getText(ar.sourceFile),
      })),
      emits: ar.emits?.map((e) => ({
        ...e,
        type: e.type.getText(ar.sourceFile),
      })),
    }))
  })

  describe('Simple', () => {
    for (const em of elementsModules) {
      test(em.name, async () => {
        const name = `${capitalize(em.name)}Simple`
        const item = findItem(name)
        const expected: Result = {
          name,
          emits: [],
          props: [],
          slots: undefined,
          imported: [],
        }
        expect(item).toEqual(expected)
      })
    }
  })

  describe('Props', () => {
    for (const em of elementsModules) {
      test(em.name, async () => {
        const name = `${capitalize(em.name)}Props`
        const item = findItem(name)
        const expected: Result = {
          name,
          emits: [],
          props: [
            { name: 'stringprop', type: 'string', optional: false },
            { name: 'numprop', type: 'number', optional: false },
            { name: 'complexprop', type: '{ value: string }', optional: false },
            { name: 'selectprop', type: "'a' | 'b'", optional: false },
            { name: 'optionalprop', type: 'string', optional: true },
          ],
          slots: undefined,
          imported: [],
        }
        expect(item).toEqual(expected)
      })
    }
  })

  describe('Emits', () => {
    for (const em of elementsModules) {
      test(em.name, async () => {
        const name = `${capitalize(em.name)}Emits`
        const item = findItem(name)
        const expected: Result = {
          name,
          emits: [
            {
              name: 'stringevent',
              type: 'string',
              optional: false,
            },
            {
              name: 'numevent',
              type: 'number',
              optional: false,
            },
            {
              name: 'objevent',
              type: '{ value: string }',
              optional: false,
            },
            {
              name: 'click',
              type: 'void',
              optional: true,
            },
          ],
          props: [],
          slots: undefined,
          imported: [],
        }
        expect(item).toEqual(expected)
      })
    }
  })

  describe('Slots', () => {
    for (const em of elementsModules) {
      test(em.name, async () => {
        const name = `${capitalize(em.name)}Slots`
        const item = findItem(name)
        const expected: Result = {
          name,
          emits: [],
          props: [],
          slots: ['named'],
          imported: [],
        }
        expect(item).toEqual(expected)
      })
    }
  })
})
