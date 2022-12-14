import { defineComponent } from 'brinejs'
import { createAutoLoaderWrapper } from 'brinejs/extensions'

const attributes = ['count', 'obj', 'text']
const apps = [
  {
    meta: { attributes, tag: 'my-vue-app' },
    loader: async () => (await import('./apps/vue')).options,
  },
  {
    meta: { attributes, tag: 'my-react-app' },
    loader: async () => (await import('./apps/react')).options,
  },
  {
    meta: { attributes, tag: 'my-svelte-app' },
    loader: async () => (await import('./apps/svelte')).options,
  },
  {
    meta: { attributes, tag: 'my-tester' },
    loader: async () => (await import('./apps/tester')).options,
  },
]

apps.forEach((app) =>
  defineComponent(createAutoLoaderWrapper(app.meta, app.loader))
)
