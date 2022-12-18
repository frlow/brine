import { createOptions } from 'brinejs/react'
import { createWrapper, defineComponent, WcWrapperOptionsMeta } from 'brinejs'
import App from './ReactApp.js'

const meta: WcWrapperOptionsMeta = {
  emits: [],
  attributes: ["count"],
  style: `.dummy-style{}`,
  tag: 'my-react-app',
}
const options = createOptions(App, meta)
const wrapper = createWrapper(options)
defineComponent(wrapper)
