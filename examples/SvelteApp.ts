import { createWrapper } from '@frlow/brine/client/svelte'
import options from './svelte'

const wrapper = createWrapper(options)
customElements.define(options.tag, wrapper)
