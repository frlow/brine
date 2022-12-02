import { createOptions } from 'brinejs/svelte'
import App from './SvelteApp.svelte'

const meta = {
  emits: ["my-event","other"],
  attributes: ["count","obj","text"],
  style: `.dummy-style{}`,
  tag: 'my-svelte-app',
}
export const options = createOptions(App, meta)
