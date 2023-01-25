import { autoDefine } from 'brinejs/svelte'
import * as App from './SvelteApp.svelte'

autoDefine({ customElementComponent: App, tag: 'my-svelte-app' })
