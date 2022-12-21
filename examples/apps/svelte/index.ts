import { define } from 'brinejs/svelte'
import type { WcWrapperOptionsMeta } from 'brinejs'
import App from './SvelteApp.svelte'

const meta: WcWrapperOptionsMeta = {
  emits: [],
  attributes: ["count"],
  style: `.dummy-style{}`,
  tag: 'my-svelte-app',
}
define(App, meta)
