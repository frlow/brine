import { WcWrapperOptionsMeta } from '@frlow/brine/client/index'
import { createOptions } from '@frlow/brine/client/react'
import App from './ReactApp'

const meta: WcWrapperOptionsMeta = {
  emits: ['my-event'],
  attributes: ['count', 'text', 'obj'],
  style: `.dummy-style{}`,
  tag: 'my-react-app',
}
export const options = createOptions(App, meta)
