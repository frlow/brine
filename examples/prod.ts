import { defineComponent } from '@frlow/brine/client/lib/index'
import { createWrapper } from '../src/client'

const setup = async () => {
  const apps = await Promise.all([
    import('./apps/react'),
    import('./apps/vue'),
    import('./apps/svelte'),
    import('./apps/vanilla'),
  ])
  const wrappers = apps.map((app) => createWrapper(app.options))
  wrappers.forEach((w) => defineComponent(w))
}

setup().then()
