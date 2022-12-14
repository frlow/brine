import { createOptions } from 'brinejs/svelte'
import App from './Tester.svelte'
import type { WcWrapperOptionsMeta } from 'brinejs'

const meta: WcWrapperOptionsMeta = {
  emits: ['my-event'],
  attributes: ['obj', 'text'],
  style: `.dummy-style{}`,
  tag: 'my-tester',
}
export const options = createOptions(App, meta)
