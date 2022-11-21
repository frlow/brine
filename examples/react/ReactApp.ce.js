import { createWrapper } from '../../src/wrapper'
import app from '../../dist/react/ReactApp'
import style from '../../dist/react/ReactApp.css'
customElements.define('undefined-react-app', createWrapper(app, style))