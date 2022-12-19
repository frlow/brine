import { defineComponent } from 'brinejs/svelte'
import App from './SvelteApp.svelte'
defineComponent(App, {
  emits: ["my-event"],
  attributes: ["count"],
  style: `.dummy-style{}`,
  tag: 'my-svelte-app',
})
