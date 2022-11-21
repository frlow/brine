import App from './VueApp.vue'
import { createApp, h } from 'vue'
import {
  vueCustomElement,
  vueCustomElementComponent,
} from '../../src/wrapper/vue'

// This is a handwritten file!
export default vueCustomElement(
  (props) => {
    return createApp({
      render: () => h(App, props),
    })
  },
  { count: false, obj: false, text: true },
  ['my-event']
)

// export default vueCustomElementComponent(App)
