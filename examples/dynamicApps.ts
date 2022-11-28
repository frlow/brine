const baseMeta = {
  emits: ['my-event'],
  attributes: ['count', 'text', 'obj'],
  style: '',
}

export const apps = [
  {
    meta: { ...baseMeta, tag: 'my-vue-app' },
    url: '/dist/vue/index.js',
  },
  {
    meta: { ...baseMeta, tag: 'my-react-app' },
    url: '/dist/react/index.js',
  },
  {
    meta: { ...baseMeta, tag: 'my-svelte-app' },
    url: '/dist/svelte/index.js',
  },
  {
    meta: { ...baseMeta, tag: 'my-vanilla' },
    url: '/dist/vanilla/index.js',
  },
]
