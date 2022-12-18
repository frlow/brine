import { createOptions } from 'brinejs/svelte'
import { createWrapper, defineComponent, WcWrapperOptionsMeta } from 'brinejs'
import App from './Tester.svelte'

const meta: WcWrapperOptionsMeta = {
  emits: ["my-event"],
  attributes: ["text","obj"],
  style: `.dummy-style{}`,
  tag: 'my-tester',
}
const options = createOptions(App, meta)
const wrapper = createWrapper(options)
defineComponent(wrapper)
