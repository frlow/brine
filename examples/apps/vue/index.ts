import { createOptions } from 'brinejs/vue'
import App from './VueApp.vue'
import { meta } from './VueApp.meta'
import { createApp, h } from 'vue'
import { createWrapper, defineComponent } from 'brinejs'

const root = (props: any) => {
  const app = createApp({
    render: () => h(App, props),
  })
  return app
}

const options = createOptions(root, meta)
const wrapper = createWrapper(options)
defineComponent(wrapper)
