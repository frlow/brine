import { showComponent } from './common'
import { elementsModules as activeElementModules } from '../src/activeModules'

const elementModules = activeElementModules.map((em) => em.name)
describe('Styling', () => {
  describe('Part base', () => {
    for (const em of elementModules) {
      test(em, async () => {
        await showComponent(`<ex-${em}-simple></ex-${em}-simple>`)
        const part = await page.evaluate(() => {
          return Array.from(
            document.body.firstElementChild?.shadowRoot?.children!
          )[1].getAttribute('part')
        })
        expect(part).toEqual('base')
      })
    }
  })

  describe('Custom styling', () => {
    for (const em of elementModules) {
      test(em, async () => {
        await showComponent(`<div>
<style>
.custom::part(base) {
color: blue
}
</style>
<ex-${em}-simple class="custom" id="custom"></ex-${em}-simple>
</div>`)
        const color = await page.evaluate(() => {
          return getComputedStyle(
            Array.from(
              document.getElementById('custom')?.shadowRoot?.children!
            )[1]
          ).getPropertyValue('color')
        })
        expect(color).toEqual('rgb(0, 0, 255)')
      })
    }
  })
})
