import { defineComponent } from 'brinejs/react'
import App from './ReactApp.js'
defineComponent(App, {
  emits: [],
  attributes: ["count"],
  style: `.dummy-style{}`,
  tag: 'my-react-app',
})
