import { define } from 'brinejs/svelte'
import App from './Tester.svelte'

define(App, {
  emits: ["my-event"] as string[],
  attributes: ["text","obj"] as string[],
  style: `.dummy-style{}` as string,
  tag: 'my-tester' as string,
})
