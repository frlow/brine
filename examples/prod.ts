import { initTransplant } from 'brinejs/transplant'

initTransplant(['my-vue-app'])
import('./apps/react')
await import('./apps/tester')
await import('./apps/svelte')

const defineLoader = (
  tag: string,
  attributes: string[],
  onLoad: () => Promise<void>
) => {
  customElements.define(
    tag,
    class extends HTMLElement {
      static get observedAttributes() {
        return attributes
      }

      constructor() {
        super()
        onLoad()
      }
    }
  )
}

defineLoader('my-vue-app', ['count'], async () => {
  import('./apps/vue')
})
