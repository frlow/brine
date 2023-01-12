import { defineAutoLoader } from 'brinejs/core'

import('./apps/react/ReactApp/myreactapp.js')
import('./apps/svelte/SvelteApp/mysvelteapp.js')
import('./apps/solid/SolidApp/mysolidapp.js')
import('./apps/svelte/Tester/mytester.js')
// import('./apps/vue/VueApp/myvueapp.js')

defineAutoLoader({
  liteMeta: require('./apps/vue/VueApp/VueApp.lite.js').lite,
  loader: () => import('./apps/vue/VueApp/myvueapp.js'),
})
