import { defineComponent } from 'brinejs'
import { createAutoLoaderWrapper } from 'brinejs/extensions'

import('./dynamicApps').then((result) => {
  result.apps.forEach((app) => {
    defineComponent(
      createAutoLoaderWrapper(app.meta, async () => {
        const result = await import(app.url)
        return result.options
      })
    )
  })
})

export {}
