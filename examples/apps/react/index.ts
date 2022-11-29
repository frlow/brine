import { createOptions } from '@frlow/brine/client/react'
import App from './ReactApp.js'

const meta = {
  emits: ["myEvent"],
  attributes: ["count","text","obj"],
  style: `.dummy-style{}`,
  tag: 'my-react-app',
}
export const options = createOptions(App, meta)
