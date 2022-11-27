import options from './vanilla'
import { createWrapper } from '@frlow/brine/client/index'

const wrapper = createWrapper(options)
customElements.define(options.tag, wrapper)
