import { defineAutoLoader } from 'brinejs/loader'

import('./apps/react')
import('./apps/svelte')
import('./apps/tester')
defineAutoLoader({
  tag: 'my-vue-app',
  attributes: ['count'],
  loader: () => import('./apps/vue'),
})
