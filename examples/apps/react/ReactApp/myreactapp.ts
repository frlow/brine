import { autoDefine } from 'brinejs/react'
import * as App from './ReactApp.js'

autoDefine({
  tag: 'my-react-app',
  customElementComponent: App,
  shadowRootMode: 'none',
})
