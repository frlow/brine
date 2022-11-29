const baseMeta = {
  attributes: ['count', 'text', 'obj'],
}
const basePath = '/dist/apps'
export const apps = [
  {
    meta: { ...baseMeta, tag: 'my-vue-app' },
    url: `${basePath}/vue/index.js`,
  },
  {
    meta: { ...baseMeta, tag: 'my-react-app' },
    url: `${basePath}/react/index.js`,
  },
  {
    meta: { ...baseMeta, tag: 'my-svelte-app' },
    url: `${basePath}/svelte/index.js`,
  },
  {
    meta: { ...baseMeta, tag: 'my-vanilla' },
    url: `${basePath}/vanilla/index.js`,
  },
]
