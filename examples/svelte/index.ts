import { WcWrapperOptionsMeta } from '@frlow/brine/client/index'
import { createOptions } from '@frlow/brine/client/svelte'
import App from './SvelteApp.svelte'

const meta: WcWrapperOptionsMeta = {
  emits: ['my-event'],
  attributes: ['count', 'text', 'obj'],
  style: `.dummy-style{}`,
  tag: 'my-svelte-app',
}

export const options = createOptions(App, meta)
