import { createOptions } from 'brinejs/svelte'
import { createWrapper, defineComponent, WcWrapperOptionsMeta } from 'brinejs'
import App from './SvelteApp.svelte'

const meta: WcWrapperOptionsMeta = {
  emits: ['my-event'],
  attributes: ['count'],
  style: `.dummy-style{}`,
  tag: 'my-vue-app',
}
const options = createOptions(App, meta)
const wrapper = createWrapper(options)
defineComponent(wrapper)
