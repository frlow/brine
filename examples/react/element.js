import { createWrapper } from '../../src/wrapper'
import reactExample from '../../dist/react/index.js'
import reactExampleStyle from '../../dist/react/index.css'

customElements.define(
  'my-react',
  createWrapper(reactExample, reactExampleStyle)
)
