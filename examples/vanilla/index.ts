import app from './VanillaApp'
import { createWrapper } from '@frlow/brine/client/index'
import { defineHotReloadedComponent } from '@frlow/brine/client/hmr'

// customElements.define('my-vanilla', createWrapper(app, style))
defineHotReloadedComponent('my-vanilla', app)
