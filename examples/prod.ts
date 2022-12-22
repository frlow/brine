import { defineAutoLoader } from 'brinejs/core'

import('./apps/react')
import('./apps/svelte')
import('./apps/tester')

defineAutoLoader({
  liteMeta: require('./apps/vue/VueApp.lite').lite,
  loader: () => import('./apps/vue'),
})
