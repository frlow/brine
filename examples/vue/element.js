import { createWrapper } from '../../src/wrapper'
import vueExample from '../../dist/vue/index.js'
import vueExampleStyle from '../../dist/vue/index.css'

customElements.define('my-vue', createWrapper(vueExample, vueExampleStyle))
