import { defineComponent, createWrapper } from 'brinejs'

Promise.all([
  import('./apps/react'),
  import('./apps/vue'),
  import('./apps/svelte'),
  import('./apps/vanilla'),
]).then((apps) =>
  apps.forEach((app) => defineComponent(createWrapper(app.options)))
)
