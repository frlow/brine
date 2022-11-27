import { createWrapper } from '@frlow/brine/client/vue'
import options from './vue'

const wrapper = createWrapper(options)
customElements.define(options.tag, wrapper)
