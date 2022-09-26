import { showWrapper } from './common'

describe('React specific problems', () => {
  test('React callback', async () => {
    await showWrapper('react', 'IncrementState')
    const clicks = Math.floor(Math.random() * 10) + 5
    for (let i = 0; i < clicks; i++) {
      await page.evaluate(() =>
        document.getElementById('test')!.firstElementChild!.dispatchEvent(
          new CustomEvent('ex-click', {
            detail: [],
            bubbles: true,
          })
        )
      )
      await new Promise((r) => setTimeout(() => r(''), 25))
    }
    const text = await page.evaluate(
      () => document.getElementById('count')!.innerText
    )
    expect(text).toEqual(`${clicks}`)
  })
})
