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
    loader: async () => (await import('./vue')).options,
  },
  {
    meta: { ...baseMeta, tag: 'my-react-app' },
    loader: async () => (await import('./react')).options,
  },
  {
    meta: { ...baseMeta, tag: 'my-svelte-app' },
    loader: async () => (await import('./svelte')).options,
  },
  {
    meta: { ...baseMeta, tag: 'my-vanilla' },
    loader: async () => (await import('./vanilla')).options,
  },
]

apps.forEach((app) =>
  defineComponent(createAutoLoaderWrapper(app.meta, app.loader))
)
