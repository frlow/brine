import { showComponent } from './common'
import { elementsModules as activeElementModules } from '../src/activeModules'

const elementModules = activeElementModules.map((em) => em.name)

describe('Elements', () => {
  describe('Simple', () => {
    for (const em of elementModules) {
      test(em, async () => {
        await showComponent(`<ex-${em}-simple></ex-${em}-simple>`)
        const text = await page.evaluate(
          () =>
            document.body.firstElementChild?.shadowRoot?.children[1].textContent
        )
        expect(text).toContain(em)
        const style = await page.evaluate(() => {
          const style = getComputedStyle(
            document.body.firstElementChild?.shadowRoot?.children[1]!
          )
          return {
            color: style.color,
            textAlign: style.textAlign,
          }
        })
        expect(style.color).toEqual('rgb(44, 62, 80)')
        expect(style.textAlign).toEqual('center')
      })
    }
  })

  describe('Props', () => {
    for (const em of elementModules) {
      test(em, async () => {
        await showComponent(`<ex-${em}-props 
stringprop="str" 
numprop="5" 
complexprop='{"value":"complex"}'
optionalprop="optional"
></ex-${em}-props>`)
        const { stringprop, numprop, complexprop, optionalprop, length } =
          await page.evaluate(() => {
            const children = Array.from(
              document.body.firstElementChild?.shadowRoot?.children!
            ).find((d) => d.tagName === 'DIV')!.children!
            return {
              stringprop: children[0].textContent,
              numprop: children[1].textContent,
              complexprop: children[2].textContent,
              optionalprop: children[3].textContent,
              length: children.length,
            }
          })
        expect(stringprop).toContain('str')
        expect(numprop).toContain('6')
        expect(complexprop).toContain('complex')
        expect(optionalprop).toContain('optional')
        expect(length).toEqual(4)
      })
    }
  })

  describe('Emits', () => {
    for (const em of elementModules) {
      test(em, async () => {
        await showComponent(
          `<ex-${em}-emits 
@ex-stringevent="window.log.push($event.detail[0])"
@ex-numevent="window.log.push($event.detail[0])"
@ex-objevent="window.log.push($event.detail[0])"
@ex-click="window.log.push($event.detail[0])"
></ex-${em}-emits>`
        )
        await page.evaluate(() => {
          document.body.firstElementChild?.shadowRoot
            ?.querySelector('button')
            ?.click()
        })
        const log = await page.evaluate(() => (window as any).log)
        expect(log).toMatchObject(['demo', 5, { value: 'val' }, null])
      })
    }
  })

  describe('Slots', () => {
    for (const em of elementModules) {
      test(em, async () => {
        await showComponent(
          `<ex-${em}-slots><span>default</span><span slot="named">named</span></ex-{em}-slots>`
        )
        const slotContent = await page.evaluate(() =>
          Array.from(
            document.body.firstElementChild?.shadowRoot?.querySelectorAll(
              'slot'
            )!
          ).map((slot) => ({
            text: slot.assignedNodes()[0].textContent,
            name: slot.name,
          }))
        )
        expect(slotContent).toMatchObject([
          { text: 'default', name: '' },
          { text: 'named', name: 'named' },
        ])
      })
    }
  })

  describe('Nested', () => {
    for (const em of elementModules) {
      test(em, async () => {
        await showComponent(`<ex-${em}-nested>
    </ex-${em}-nested>
    <ex-${em}-nested-child></ex-solid-${em}-child>`)
        // The child element should have been excluded and therefore not rendered
        // If it is not excluded, expected result should be Parent Child Child
        const elements = await page.evaluate(() => {
          const mapChildren = (el: any): any =>
            Array.from(el.children).map((ch: any) => ({
              tag: ch.tagName,
              text: ch.textContent,
              children: ch.children ? mapChildren(ch) : [],
            }))
          return mapChildren(document.body.firstElementChild?.shadowRoot)
        })
        const div = elements.find((d: any) => d.tag === 'DIV')
        expect(div.children.length).toEqual(2)
        expect(div.children[0].text).toEqual('Parent')
        expect(div.children[1].text).toEqual('Child')
      })
    }
  })

  describe('State', () => {
    for (const em of elementModules) {
      test(em, async () => {
        await showComponent(`<ex-${em}-state></ex-${em}-state>`)
        for (let i = 0; i < 6; i++) {
          await page.evaluate(() => {
            document.body.firstElementChild?.shadowRoot
              ?.querySelector('button')
              ?.click()
          })
        }

        const text = await page.evaluate(
          () => document.body.firstElementChild?.shadowRoot?.textContent
        )
        expect(text).toEqual('6')
      })
    }
  })

  describe('Bool', () => {
    for (const em of elementModules) {
      test(em, async () => {
        await showComponent(`
<ex-${em}-bool></ex-${em}-bool>
<ex-${em}-bool enable></ex-${em}-bool>
<ex-${em}-bool enable="true"></ex-${em}-bool>
<ex-${em}-bool enable="false"></ex-${em}-bool>
`)
        const text = await page.evaluate(() =>
          Array.from(document.body.children)
            .map((c: any) => c.shadowRoot?.textContent)
            .join('')
        )
        expect(text).toEqual('DisabledEnabledEnabledDisabled')
      })
    }
  })
})
