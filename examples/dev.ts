import { createTransplantableWrapper } from '@frlow/brine/lib/client/extensions/transplant'
import { defineComponent } from '@frlow/brine/lib/client/index'
import { initHmr } from '@frlow/brine/lib/client/hmr'

const setup = async () => {
  const apps = await Promise.all([
    import('./apps/react'),
    import('./apps/vue'),
    import('./apps/svelte'),
    import('./apps/vanilla'),
  ])
  const wrappers = apps.map((app) => createTransplantableWrapper(app.options))
  wrappers.forEach((w) => defineComponent(w))
  initHmr(wrappers)
}

setup().then()
