import { createWrapper } from '@frlow/brine/client/react'
import options from './react'

const wrapper = createWrapper(options)
customElements.define(options.tag, wrapper)
