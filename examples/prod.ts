import { defineComponent, createWrapper } from '@frlow/brine'

Promise.all([
  import('./apps/react'),
  import('./apps/vue'),
  import('./apps/svelte'),
  import('./apps/vanilla'),
]).then((apps) =>
  apps.forEach((app) => defineComponent(createWrapper(app.options)))
)
