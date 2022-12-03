import { createTransplantableWrapper } from 'brinejs/extensions'
import { defineComponent } from 'brinejs'

Promise.all([
  import('./apps/react'),
  import('./apps/vue'),
  import('./apps/svelte'),
  import('./apps/vanilla'),
]).then((apps) =>
  apps.forEach((app) =>
    defineComponent(createTransplantableWrapper(app.options))
  )
)

// new WebSocket('ws://localhost:8080').onmessage = async (ev) => {
//   import(ev.data).then((r) => {
//     if (r.options?.tag)
//       (customElements.get(r.options.tag) as any).transplant(r.options)
//   })
// }
