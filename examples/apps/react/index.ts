import { createOptions } from '@frlow/brine/react'
import App from './ReactApp.js'

const meta = {
  emits: ["my-event"],
  attributes: ["count","text","obj"],
  style: `.dummy-style{}`,
  tag: 'my-react-app',
}
export const options = createOptions(App, meta)
