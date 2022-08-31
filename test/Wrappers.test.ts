import { showWrapper } from './common'
import { decode } from 'he'
import { elementsModules, wrapperModules } from '../src/activeModules'
import { AnalysisResult, analyze } from '../src/modules/analyze'
import { getFileMap } from '../src/utils/findFiles'
import path from 'path'

describe('Wrappers', () => {
  describe('Simple', () => {
    for (const wm of wrapperModules) {
      test(wm.name, async () => {
        await showWrapper({ name: 'SvelteSimple' }, wm)
        const content = await page.evaluate(
          () => document.getElementById('app')!.firstElementChild!.outerHTML
        )
        expect(content).toEqual(`<ex-svelte-simple></ex-svelte-simple>`)
      })
    }
  })

  describe('Props', () => {
    for (const wm of wrapperModules) {
      test(wm.name, async () => {
        await showWrapper(
          {
            name: 'SvelteProps',
            props: {
              stringprop: 'str',
              numprop: 6,
              complexprop: { value: 'val' },
            },
          },
          wm
        )
        const content = await page.evaluate(
          () => document.getElementById('app')!.firstElementChild!.outerHTML
        )
        expect(decode(content)).toEqual(
          `<ex-svelte-props stringprop="str" numprop="6" complexprop="{\"value\":\"val\"}"></ex-svelte-props>`
        )
      })
    }
  })

  describe('Emits', () => {
    for (const wm of wrapperModules) {
      test(wm.name, async () => {
        const component = {
          name: 'SvelteEmits',
          emits: {
            stringevent: 'str',
            numevent: 4,
            objevent: { value: 'val' },
            click: null,
          },
        }
        await showWrapper(component, wm)
        await Promise.all(
          Object.entries(component.emits || {}).map(([key, value]) => {
            return page.evaluate(
              ({ key, value }) =>
                document
                  .getElementById('app')!
                  .firstElementChild!.dispatchEvent(
                    new CustomEvent('ex-' + key, {
                      detail: [value],
                      bubbles: true,
                    })
                  ),
              { key, value }
            )
          })
        )
        const log = await page.evaluate(() => (window as any).log)
        expect(log).toMatchObject(['str', 4, { value: 'val' }, null])
      })
    }
  })

  describe('Slots', () => {
    for (const wm of wrapperModules) {
      test(wm.name, async () => {
        await showWrapper(
          {
            name: 'SvelteSlots',
            children: [
              { name: 'SvelteSimple' },
              { name: 'ReactSimple', slot: 'named' },
            ],
          },
          wm
        )
        const content = await page.evaluate(
          () => document.getElementById('app')!.firstElementChild!.outerHTML
        )
        expect(decode(content)).toEqual(
          `<ex-svelte-slots><ex-svelte-simple></ex-svelte-simple><ex-react-simple slot="named"></ex-react-simple></ex-svelte-slots>`
        )
      })
    }
  })

  describe('Auto import', () => {
    let results: AnalysisResult[]
    beforeAll(async () => {
      const result = await analyze(
        'test/example',
        elementsModules,
        'ex',
        'dist',
        (filePath) => {}
      )
      results = result.analysisResults
    })

    test('FileMap', async () => {
      const fileMap = getFileMap(path.join('test', 'dist'))
      expect(fileMap.SvelteSimple).toEqual('elements/svelte/SvelteSimple.js')
      expect(fileMap.ReactSimple).toEqual('elements/react/ReactSimple.js')
      expect(fileMap.VueSimple).toEqual('elements/vue/VueSimple.js')
      expect(fileMap.SolidSimple).toEqual('elements/solid/SolidSimple.solid.js')
    })
  })
})
