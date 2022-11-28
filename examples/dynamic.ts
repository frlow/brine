import { defineComponent } from '@frlow/brine/client/index'
import { createAutoLoaderWrapper } from '@frlow/brine/client/extensions/autoLoader'

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
