import { define } from 'brinejs/solid'
import App from './SolidApp.js'

define(App, {
  emits: [] as string[],
  attributes: ["count"] as string[],
  style: `.dummy-style{}` as string,
  tag: 'my-solid-app' as string,
})
