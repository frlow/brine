import vanilla from './vanilla'
import react from './react'
import vue from './vue'
import svelte from './svelte'
import { createWrapper, WcWrapperOptions } from '@frlow/brine/client/index'

const defineWc = (options: WcWrapperOptions) => {
  const wrapper = createWrapper(options)
  if (!customElements.get(options.tag))
    customElements.define(options.tag, wrapper)
  else {
    debugger
  }
}

defineWc(react)
defineWc(vue)
defineWc(svelte)
defineWc(vanilla)
