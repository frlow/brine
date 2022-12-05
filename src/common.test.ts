import {
  createWrapper,
  defineComponent,
  WcWrapperOptions,
  WcWrapperOptionsMeta,
} from './index.js'
import { Plugin, build } from 'esbuild'
import path from 'path'
import fs from 'fs'
import { screen } from '@testing-library/dom'

export const buildApp = async (
  code: string,
  fileName: string,
  plugins: Plugin[]
): Promise<any> => {
  const tempDir = './src/temp'
  fs.mkdirSync(tempDir, { recursive: true })
  fs.writeFileSync(path.join(tempDir, fileName), code, 'utf8')
  const result = await build({
    entryPoints: [path.join(tempDir, fileName)],
    bundle: true,
    format: 'esm',
    write: false,
    plugins,
    outdir: tempDir,
  })
  fs.rmSync(tempDir, { recursive: true })
  const base64 = Buffer.from(
    result.outputFiles.find((f) => f.path.endsWith('.js')).text
  ).toString('base64')
  const dataUrl = `data:text/javascript;base64,${base64}`
  const importResult = await import(dataUrl)
  return importResult.default
}

export type WrapperTestCases = {
  stringText: string
  stringProp: string
  numProp: string
  objProp: string
}

export const testWrapper = (
  createOptions: (
    component: any,
    meta: WcWrapperOptionsMeta
  ) => WcWrapperOptions,
  testCases: Partial<WrapperTestCases>,
  plugins: Plugin[],
  fileName: string
) => {
  async function defineWrapper(code: string, meta: WcWrapperOptionsMeta) {
    const app = await buildApp(code, fileName, plugins)
    const options = createOptions(app, meta)
    const wrapper = createWrapper(options)
    defineComponent(wrapper)
  }

  test('String div simple component', async () => {
    const meta: WcWrapperOptionsMeta = {
      tag: 'test-string-text',
      style: '',
      attributes: [],
      emits: [],
    }
    await defineWrapper(testCases.stringText, meta)
    document.body.innerHTML = `<test-string-text role="test"></test-string-text>`
    const el = screen.getByRole('test')
    const innerHtml = el.shadowRoot.innerHTML
    expect(innerHtml).toContain('simple-string-text')
  })
  describe('props', () => {
    test('String', async () => {
      const meta: WcWrapperOptionsMeta = {
        tag: 'test-string-prop',
        style: '',
        attributes: ['text'],
        emits: [],
      }
      await defineWrapper(testCases.stringProp, meta)
      document.body.innerHTML = `<test-string-prop role="test" text="aaa"></test-string-prop>`
      const el = screen.getByRole('test')
      expect(el.shadowRoot.innerHTML).toContain('aaa')
      el.setAttribute('text', 'bbb')
      await new Promise((r) => setTimeout(() => r(''), 0))
      expect(el.shadowRoot.innerHTML).toContain('bbb')
    })
    test('Number', async () => {
      const meta: WcWrapperOptionsMeta = {
        tag: 'test-number-prop',
        style: '',
        attributes: ['num'],
        emits: [],
      }
      await defineWrapper(testCases.numProp, meta)
      document.body.innerHTML = `<test-number-prop role="test" num="6"></test-number-prop>`
      const el = screen.getByRole('test')
      expect(el.shadowRoot.innerHTML).toContain('7')
      el.setAttribute('num', '4')
      await new Promise((r) => setTimeout(() => r(''), 0))
      expect(el.shadowRoot.innerHTML).toContain('5')
    })
    test('Object', async () => {
      const meta: WcWrapperOptionsMeta = {
        tag: 'test-object-prop',
        style: '',
        attributes: ['obj'],
        emits: [],
      }
      await defineWrapper(testCases.objProp, meta)
      document.body.innerHTML = `<test-object-prop role="test" obj='{"val": "aaa"}'></test-object-prop>`
      const el = screen.getByRole('test')
      expect(el.shadowRoot.innerHTML).toContain('aaa')
      el.setAttribute('obj', '{"val": "bbb"}')
      await new Promise((r) => setTimeout(() => r(''), 0))
      expect(el.shadowRoot.innerHTML).toContain('bbb')
    })
  })
}
