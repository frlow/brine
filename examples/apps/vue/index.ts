import { createOptions } from '@frlow/brine/vue'
import App from './VueApp.vue'
import { meta } from './VueApp.meta'
import { createApp, h } from 'vue'

const root = (props: any) => {
  const app = createApp({
    render: () => h(App, props),
  })
  console.warn('Custom vue createApp')
  return app
}

export const options = createOptions(root, meta)
