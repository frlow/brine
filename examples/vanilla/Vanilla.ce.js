import { createWrapper } from '../../src/wrapper'
import app from '../../dist/vanilla/Vanilla'
import style from '../../dist/vanilla/Vanilla.css'
customElements.define('undefined-vanilla', createWrapper(app, style))