import { defineComponent } from '@frlow/brine/lib/client/index'
import { createWrapper } from '../src/client'

Promise.all([
  import('./apps/react'),
  import('./apps/vue'),
  import('./apps/svelte'),
  import('./apps/vanilla'),
]).then((apps) =>
  apps.forEach((app) => defineComponent(createWrapper(app.options)))
)
