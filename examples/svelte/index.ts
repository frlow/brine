import { svelteCustomElementComponent } from '../../src/wrapper/svelte'
import App from './App.svelte'

export default svelteCustomElementComponent(
  App,
  { count: false, obj: false, text: true },
  ['my-event']
)
