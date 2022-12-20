import { initTransplant } from 'brinejs/transplant'

initTransplant()

const defineLoader = (tag: string, attributes: string[], onLoad: () => any) => {
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
const apps = [
  {
    name: 'my-vue-app',
    attributes: ['count'],
    loader: () => import('./apps/vue'),
  },
  {
    name: 'my-react-app',
    attributes: ['count'],
    loader: () => import('./apps/react'),
  },
  {
    name: 'my-svelte-app',
    attributes: ['count'],
    loader: () => import('./apps/svelte'),
  },
  {
    name: 'my-tester',
    attributes: ['text', 'obj'],
    loader: () => import('./apps/tester'),
  },
]
apps.forEach((app) => defineLoader(app.name, app.attributes, app.loader))
if (process.env.NODE_ENV === 'development')
  new WebSocket('ws://localhost:8080').onmessage = (ev) =>
    import(ev.data + `?t=${Date.now()}`)
