import { WcWrapperOptions, WcWrapperOptionsMeta } from './common.js'
import { Plugin, build } from 'esbuild'
import path from 'path'
import fs from 'fs'
import { screen } from '@testing-library/dom'
import { jest } from '@jest/globals'
import { baseDefine } from './define.js'

export type WrapperTestCases = {
  stringText: string
  stringProp: string
  numProp: string
  objProp: string
  onMountProps: string
  simpleEvent: string
  openClosed: string
}

export const testWrapper = (
  createOptions: (
    component: any,
    meta: WcWrapperOptionsMeta
  ) => WcWrapperOptions,
  testCases: Partial<WrapperTestCases>,
  plugins: Plugin[],
  external: string[],
  extension: string,
  tsconfig?: string
) => {
  const tempDir = './src/temp'
  const buildApp = async (
    code: string,
    fileName: string,
    plugins: Plugin[],
    external: string[]
  ): Promise<any> => {
    fs.mkdirSync(tempDir, { recursive: true })
    fs.writeFileSync(path.join(tempDir, fileName), code, 'utf8')
    let filePath = path.join(
      tempDir,
      (Math.random() + 1).toString(36).substring(7) + '.js'
    )
    await build({
      entryPoints: [path.join(tempDir, fileName)],
      external,
      bundle: true,
      format: 'esm',
      write: true,
      plugins,
      outfile: filePath,
      tsconfig,
    })

    const importPath = path.resolve(filePath)
    const importResult = await import(importPath)
    return importResult.default
  }

  afterEach(() => {
    jest.clearAllMocks()
    fs.rmSync(tempDir, { recursive: true })
    Array.from(document.body.children).forEach((el) =>
      document.body.removeChild(el)
    )
    document.body.innerHTML = ''
  })

  async function defineWrapper(code: string, meta: WcWrapperOptionsMeta) {
    const app = await buildApp(code, 'TestApp' + extension, plugins, external)
    const options = createOptions(app, meta)
    baseDefine(options, options.tag)
  }

  describe('Simple', () => {
    test('Component, should render text in component', async () => {
      const meta: WcWrapperOptionsMeta = {
        tag: 'test-string-text',
        style: '',
        attributes: [],
        emits: [],
      }
      await defineWrapper(testCases.stringText, meta)
      document.body.innerHTML = `<test-string-text role="test"></test-string-text>`
      await new Promise((r) => setTimeout(() => r(''), 0))
      const el = screen.getByRole('test') as any
      const innerHtml = el.root.innerHTML
      expect(innerHtml).toContain('simple-string-text')
    })

    test('Should be able to set open shadow root', async () => {
      const metaClosed: WcWrapperOptionsMeta = {
        tag: 'test-open-closed-closed',
        style: '',
        attributes: [],
        emits: [],
      }
      await defineWrapper(testCases.openClosed, metaClosed)
      document.body.innerHTML = `<test-open-closed-closed role="test-closed"></test-open-closed-closed>`
      await new Promise((r) => setTimeout(() => r(''), 0))
      const elClosed = screen.getByRole('test-closed') as any
      expect(elClosed.shadowRoot).toBeFalsy()

      const metaOpen: WcWrapperOptionsMeta = {
        tag: 'test-open-closed-open',
        style: '',
        attributes: [],
        emits: [],
        shadowRootMode: 'open',
      }
      await defineWrapper(testCases.openClosed, metaOpen)
      document.body.innerHTML = `<test-open-closed-open role="test-open"></test-open-closed-open>`
      await new Promise((r) => setTimeout(() => r(''), 0))
      const elOpen = screen.getByRole('test-open') as any
      expect(elOpen.shadowRoot).not.toBeFalsy()
    })
  })

  describe('Props, should set and update', () => {
    test('String', async () => {
      const meta: WcWrapperOptionsMeta = {
        tag: 'test-string-prop',
        style: '',
        attributes: ['text'],
        emits: [],
      }
      await defineWrapper(testCases.stringProp, meta)
      document.body.innerHTML = `<test-string-prop role="test" text="aaa"></test-string-prop>`
      await new Promise((r) => setTimeout(() => r(''), 0))
      const el = screen.getByRole('test') as any
      expect(el.root.innerHTML).toContain('aaa')
      el.setAttribute('text', 'bbb')
      await new Promise((r) => setTimeout(() => r(''), 0))
      expect(el.root.innerHTML).toContain('bbb')
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
      await new Promise((r) => setTimeout(() => r(''), 0))
      const el: any = screen.getByRole('test')
      expect(el.root.innerHTML).toContain('61')
      el.num = 7
      await new Promise((r) => setTimeout(() => r(''), 0))
      expect(el.root.innerHTML).toContain('8')
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
      await new Promise((r) => setTimeout(() => r(''), 0))
      const el: any = screen.getByRole('test')
      expect(el.root.innerHTML).not.toContain('aaa')
      el.obj = { val: 'aaa' }
      await new Promise((r) => setTimeout(() => r(''), 0))
      expect(el.root.innerHTML).toContain('aaa')
    })
    test('Props available on mount', async () => {
      const meta: WcWrapperOptionsMeta = {
        tag: 'test-on-mount-prop',
        style: '',
        attributes: ['text'],
        emits: [],
      }
      await defineWrapper(testCases.onMountProps, meta)
      const log = jest.spyOn(console, 'log').mockImplementation(() => {})
      document.body.innerHTML = `<test-on-mount-prop role="test" text='aaa'></test-on-mount-prop>`
      await new Promise((r) => setTimeout(() => r(''), 0))
      expect(log).toBeCalledWith('aaa')
    })
  })
  describe('Emits', () => {
    test('Send event', async () => {
      const meta: WcWrapperOptionsMeta = {
        tag: 'test-simple-event',
        style: '',
        attributes: [],
        emits: ['my-event'],
      }
      await defineWrapper(testCases.simpleEvent, meta)
      let resolve: any
      const callbackPromise = new Promise((r) => {
        resolve = r
      })
      const callback = (e: any) => resolve(e)
      document.body.innerHTML = `<test-simple-event role="test"></test-simple-event>`
      await new Promise((r) => setTimeout(() => r(''), 0))
      const el = screen.getByRole('test') as any
      el.addEventListener('my-event', callback)
      const button = el.root.getElementById('button')
      button.click()
      const e = (await callbackPromise) as any
      expect(e.detail).toEqual('simple')
    })
  })
}
