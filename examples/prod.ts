import { defineAutoLoader } from 'brinejs/core'

import('./apps/react/myreactapp.js')
import('./apps/svelte/mysvelteapp.js')
import('./apps/tester/mytester.js')

defineAutoLoader({
  liteMeta: require('./apps/vue/VueApp.lite').lite,
  loader: () => import('./apps/vue/myvueapp.js'),
})
