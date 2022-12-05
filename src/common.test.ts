import { createWrapper, defineComponent, WcWrapperOptions } from './index.js'
import { Plugin, build } from 'esbuild'
import path from 'path'
import fs from 'fs'
import { screen } from '@testing-library/dom'

export type WrapperTestCases = {
  stringText: () => Promise<WcWrapperOptions>
}
const currentDir = path.join(process.cwd(), 'src')
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

export const testWrapper = (testCases: Partial<WrapperTestCases>) => {
  test('String div simple component', async () => {
    const options = await testCases.stringText()
    const wrapper = createWrapper(options)
    defineComponent(wrapper)
    document.body.innerHTML = `<test-string-text role="test"></test-string-text>`
    const el = screen.getByRole('test')
    const innerHtml = el.shadowRoot.innerHTML
    expect(innerHtml).toEqual('<style></style><div><div>text</div></div>')
  })
}
