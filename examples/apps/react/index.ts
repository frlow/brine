import { define } from 'brinejs/react'
import type { WcWrapperOptionsMeta } from 'brinejs'
import App from './ReactApp.js'

const meta: WcWrapperOptionsMeta = {
  emits: [],
  attributes: ["count"],
  style: `.dummy-style{}`,
  tag: 'my-react-app',
}
define(App, meta)
