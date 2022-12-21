import { define } from 'brinejs/svelte'
import App from './SvelteApp.svelte'

define(App, {
  emits: [] as string[],
  attributes: ["count"] as string[],
  style: `.dummy-style{}` as string,
  tag: 'my-svelte-app' as string,
})
