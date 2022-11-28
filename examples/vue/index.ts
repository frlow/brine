import { WcWrapperOptionsMeta } from '@frlow/brine/client/index'
import App from './VueApp.vue'
import { createOptions } from '@frlow/brine/client/vue'

const meta: WcWrapperOptionsMeta = {
  emits: ['my-event'],
  attributes: ['count', 'text', 'obj'],
  style: `.dummy-style{}`,
  tag: 'my-vue-app',
}

// const app = (props: any) =>
//   createApp({
//     render: () => h(App, props),
//   })
export const options = createOptions(App, meta)
