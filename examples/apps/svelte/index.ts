import { createOptions } from 'brinejs/svelte'
import App from './SvelteApp.svelte'

const meta = {
  emits: [],
  attributes: ["count"],
  style: `.dummy-style{}`,
  tag: 'my-svelte-app',
}
export const options = createOptions(App, meta)
