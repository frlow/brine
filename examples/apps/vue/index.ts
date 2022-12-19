import { defineComponent } from 'brinejs/vue'
import App from './VueApp.vue'
import { meta } from './VueApp.meta'
import { createApp, h } from 'vue'

const root = (props: any) => {
  const app = createApp({
    render: () => h(App, props),
  })
  return app
}

defineComponent(root, meta)
