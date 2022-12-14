import { createTransplantableWrapper } from 'brinejs/extensions'
import { defineComponent } from 'brinejs'

Promise.all([
  import('./apps/react'),
  import('./apps/vue'),
  import('./apps/svelte'),
]).then((apps) =>
  apps.forEach((app) =>
    defineComponent(createTransplantableWrapper(app.options))
  )
)
