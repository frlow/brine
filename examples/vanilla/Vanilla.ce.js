import { createWrapper } from '../../src/wrapper'
import app from '../../dist/vanilla/Vanilla'
import style from '../../dist/vanilla/Vanilla.css'

// This is a handwritten file!!!
customElements.define('my-vanilla', createWrapper(app, style))
