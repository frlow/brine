import { defineComponent } from '@frlow/brine'
import { createAutoLoaderWrapper } from '@frlow/brine/extensions'

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
