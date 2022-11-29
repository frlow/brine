import { createOptions } from '@frlow/brine/client/vue'
import App from './VueApp.vue'
import { meta } from './VueApp.meta'
import { createApp, h } from 'vue'

const root = (props: any) => {
  const app = createApp({
    render: () => h(App, props),
  })
  console.log('App: ', app)
  return app
}

export const options = createOptions(root, meta)
