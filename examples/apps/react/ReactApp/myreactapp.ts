import { define } from 'brinejs/react'
import App from './ReactApp.js'

define(App, {
  emits: [] as string[],
  attributes: ["count"] as string[],
  style: `.dummy-style{}` as string,
  tag: 'my-react-app' as string,
})
