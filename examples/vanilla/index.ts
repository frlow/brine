import app from './VanillaApp'
import { createWrapper } from '@frlow/brine/client/index'

const style = `.demo {
    color: blue;
}`

customElements.define('my-vanilla', createWrapper(app, style))
