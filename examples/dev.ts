import { createTransplantableWrapper } from '@frlow/brine/lib/client/extensions/transplant'
import { defineComponent } from '@frlow/brine/lib/client/index'

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

const ws = new WebSocket('ws://localhost:8080')
ws.onmessage = async (ev) => {
  import(ev.data).then((r) => {
    if (r.options?.tag)
      (customElements.get(r.options.tag) as any).transplant(r.options)
  })
}
