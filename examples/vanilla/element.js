import { createWrapper } from '../../src/wrapper'
import vanilla from '../../dist/vanilla/index.js'
import vanillaStyle from '../../dist/vanilla/index.css'

customElements.define('my-vanilla', createWrapper(vanilla, vanillaStyle))
