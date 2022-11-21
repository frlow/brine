// This is a handwritten file!!!
import { createWrapper } from '../../src/wrapper'
import app from '../../dist/temp/vanilla/main'
import style from '../../dist/temp/vanilla/main.css'

customElements.define('my-vanilla', createWrapper(app, style))
