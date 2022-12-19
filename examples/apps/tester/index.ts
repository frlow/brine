import { defineComponent } from 'brinejs/svelte'
import App from './Tester.svelte'
defineComponent(App, {
  emits: ["my-event"],
  attributes: ["text","obj"],
  style: `.dummy-style{}`,
  tag: 'my-tester',
})
