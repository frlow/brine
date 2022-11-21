import { createWrapper } from '../../src/wrapper'
import app from '../../dist/svelte/SvelteApp'
import style from '../../dist/svelte/SvelteApp.css'
customElements.define('undefined-svelte-app', createWrapper(app, style))