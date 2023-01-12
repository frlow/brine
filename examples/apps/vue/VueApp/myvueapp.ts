import { define } from 'brinejs/vue'
import App from './VueApp.vue'

define(App, {
  emits: [] as string[],
  attributes: ["count"] as string[],
  style: `.dummy-style{}` as string,
  tag: 'my-vue-app' as string,
})
