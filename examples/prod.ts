import { initTransplant } from './tranplant.js'

initTransplant()
import('./apps/react')
await import('./apps/tester')
await import('./apps/vue')
// customElements.define(
//   'my-vue-app',
//   class extends HTMLElement {
//     static get observedAttributes() {
//       return ['count']
//     }
//   }
// )
await new Promise((r) => setTimeout(() => r(''), 3000))
await import('./apps/svelte')
