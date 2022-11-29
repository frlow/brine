import { defineComponent } from '@frlow/brine/client/index'
import { createAutoLoaderWrapper } from '@frlow/brine/client/extensions/autoLoader'

const baseMeta = {
  emits: ['MyEvent'],
  attributes: ['count', 'obj', 'text'],
  style: `.dummy-style{}`,
}
const apps = [
  {
    meta: { ...baseMeta, tag: 'my-vue-app' },
    loader: async () => (await import('./apps/vue')).options,
  },
  {
    meta: { ...baseMeta, tag: 'my-react-app' },
    loader: async () => (await import('./apps/react')).options,
  },
  {
    meta: { ...baseMeta, tag: 'my-svelte-app' },
    loader: async () => (await import('./apps/svelte')).options,
  },
  {
    meta: { ...baseMeta, tag: 'my-vanilla' },
    loader: async () => (await import('./apps/vanilla')).options,
  },
]

apps.forEach((app) =>
  defineComponent(createAutoLoaderWrapper(app.meta, app.loader))
)
