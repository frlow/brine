import { autoDefine } from 'brinejs/svelte'
import * as App from './Tester.svelte'

autoDefine({ tag: 'my-tester', customElementComponent: App })
