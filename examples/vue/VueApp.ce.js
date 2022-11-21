import { createWrapper } from '../../src/wrapper'
import app from '../../dist/vue/VueApp'
import style from '../../dist/vue/VueApp.css'
customElements.define('undefined-vue-app', createWrapper(app, style))