import { wrapperModules } from '../src/activeModules'
import {
  buildExample,
  buildTestApp,
  getTestHtml,
  showComponent,
} from './common'
import * as fs from 'fs'
import path from 'path'

const showWrapper = async (framework: string, testCase: string) => {
  const code = await buildTestApp(framework, testCase)
  await showComponent('<div id="app">Loading...</div>', code)
  await page.waitForSelector('#test')
}

const evaluateWrapper = async (framework: string, testCase: string) => {
  await showWrapper(framework, testCase)
  return await page.evaluate(() => document.getElementById('test')!.innerHTML)
}

test('Dummy', async () => {
  // Run this to generate a page to test manually
  jest.setTimeout(1000000)
  const html = getTestHtml('<div id="app">Loading...</div>')
  const code = await buildTestApp('vue', 'Props')
  const dir = path.join('test', 'dist', 'dummy')
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true })
  fs.mkdirSync(dir)
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8')
  fs.writeFileSync(path.join(dir, 'index.js'), code, 'utf8')
})

jest.setTimeout(30000)
describe('Wrappers', () => {
  beforeAll(async () => await buildExample(false))
  describe('Simple', () => {
    for (const wm of wrapperModules) {
      test(wm.name, async () =>
        expect(await evaluateWrapper(wm.name, 'Simple')).toEqual(
          `<ex-svelte-simple></ex-svelte-simple>`
        )
      )
    }
  })
  describe('Props', () => {
    for (const wm of wrapperModules) {
      test(wm.name, async () => {
        const result = await evaluateWrapper(wm.name, 'Props')
        expect(result).toEqual(
          `<ex-svelte-props stringprop="str" numprop="6" complexprop=\"{&quot;value&quot;:&quot;val&quot;}\"></ex-svelte-props>`
        )
      })
    }
  })

  describe('Emits', () => {
    for (const wm of wrapperModules) {
      test(wm.name, async () => {
        const emits = [
          { name: 'stringevent', value: 'str' },
          { name: 'numevent', value: 4 },
          { name: 'objevent', value: { value: 'val' } },
          { name: 'click', value: null },
        ]
        await showWrapper(wm.name, 'Emits')
        for (const emit of emits) {
          await page.evaluate(
            ({ key, value }) =>
              document.getElementById('test')!.firstElementChild!.dispatchEvent(
                new CustomEvent('ex-' + key, {
                  detail: [value],
                  bubbles: true,
                })
              ),
            { key: emit.name, value: emit.value }
          )
        }
        const log = await page.evaluate(() => (window as any).log)
        expect(log).toMatchObject(['str', 4, { value: 'val' }, null])
      })
    }
  })

  describe('Slots', () => {
    for (const wm of wrapperModules) {
      test(wm.name, async () => {
        expect(await evaluateWrapper(wm.name, 'Slots')).toEqual(
          `<ex-svelte-slots><ex-svelte-simple></ex-svelte-simple><ex-svelte-simple slot="named"></ex-svelte-simple></ex-svelte-slots>`
        )
      })
    }
  })
})
