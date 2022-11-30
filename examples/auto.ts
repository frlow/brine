import { defineComponent } from '@frlow/brine/lib/client/index'
import { createAutoLoaderWrapper } from '@frlow/brine/lib/client/extensions/autoLoader'

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
    meta: { attributes, tag: 'my-vanilla' },
    loader: async () => (await import('./apps/vanilla')).options,
  },
]

apps.forEach((app) =>
  defineComponent(createAutoLoaderWrapper(app.meta, app.loader))
)
