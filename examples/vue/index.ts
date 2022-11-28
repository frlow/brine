import { createOptions } from '@frlow/brine/client/vue'
import App from './VueApp.vue'

const meta = {
  emits: ["my-event"],
  attributes: ["count","text","obj"],
  style: `.dummy-style{}`,
  tag: 'my-vue-app',
}
export const options = createOptions(App, meta)
