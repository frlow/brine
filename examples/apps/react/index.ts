import { createOptions } from 'brinejs/react'
import type { WcWrapperOptionsMeta } from 'brinejs'
import App from './ReactApp.js'

const meta: WcWrapperOptionsMeta = {
  emits: [],
  attributes: ["count"],
  style: `.dummy-style{}`,
  tag: 'my-react-app',
}
export const options = createOptions(App, meta)
