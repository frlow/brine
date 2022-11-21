import {reactCustomElementComponent} from '../../src/wrapper/react'
import App from './ReactApp'

export default reactCustomElementComponent(
  App,
  {count: false, text: true, obj: false},
  ['my-event']
)
