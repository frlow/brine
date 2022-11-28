import { createOptions } from '@frlow/brine/client/svelte'
import App from './SvelteApp.svelte'

const meta = {
  emits: ["MyEvent"],
  attributes: ["count","obj","text"],
  style: `.dummy-style{}`,
  tag: 'my-svelte-app',
}
export const options = createOptions(App, meta)
