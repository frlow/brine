import { defineComponent } from '@frlow/brine/lib/client/index'
import { createAutoLoaderWrapper } from '@frlow/brine/lib/client/extensions/autoLoader'

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
