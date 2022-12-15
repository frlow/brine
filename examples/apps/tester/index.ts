import { createOptions } from 'brinejs/svelte'
import type { WcWrapperOptionsMeta } from 'brinejs'
import App from './Tester.svelte'

const meta: WcWrapperOptionsMeta = {
  emits: ["my-event"],
  attributes: ["text","obj"],
  style: `.dummy-style{}`,
  tag: 'my-tester',
}
export const options = createOptions(App, meta)
