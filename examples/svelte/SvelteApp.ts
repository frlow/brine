import {svelteCustomElementComponent} from '../../src/wrapper/svelte'
import App from './SvelteApp.svelte'

export default svelteCustomElementComponent(
  App,
  {count: false, obj: false, text: true},
  ['my-event']
)
