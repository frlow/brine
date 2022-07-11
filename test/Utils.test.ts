import { showComponent, showWrapper } from './example/common'
import { wrapperModules } from '../src/activeModules'

describe('Utils', () => {
  test('Intercept request', async () => {
    await showComponent('Demo')
    expect(await page.evaluate(() => document.body.textContent)).toContain(
      'Demo'
    )
  })

  test('Simple custom element', async () => {
    await showComponent('<ex-react-simple></ex-react-simple>')
    const text = await page.evaluate(
      () => document.body.firstElementChild?.shadowRoot?.textContent
    )
    expect(text).toContain('dummy')
  })

  test('Simple wrapper', async () => {
    await showWrapper(
      { name: 'ReactSimple' },
      wrapperModules.find((d) => d.name === 'react')!
    )
    const content = await page.evaluate(
      () => document.getElementById('app')!.innerHTML
    )
    expect(content).toEqual('<ex-react-simple></ex-react-simple>')
  })
})
