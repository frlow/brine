// This is a handwritten file!!!
import App from './VueApp.vue'
import { createApp, h } from 'vue'
import {
  vueCustomElement,
  vueCustomElementComponent,
} from '../../src/wrapper/vue'

export default vueCustomElementComponent(
  (props) => {
    return createApp({
      render: () => h(App, props),
    })
  },
  { count: false, obj: false, text: true },
  ['my-event']
)

// export default vueCustomElement(App)
