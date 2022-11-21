import { createWrapper } from '../../src/wrapper'
import svelteExample from '../../dist/svelte/index.js'
import svelteExampleStyle from '../../dist/svelte/index.css'

customElements.define(
  'my-svelte',
  createWrapper(svelteExample, svelteExampleStyle)
)
