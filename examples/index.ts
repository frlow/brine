import { createWrapper, defineComponent } from '@frlow/brine/client/index'
import { createTransplantableWrapper } from '@frlow/brine/client/extensions/transplant'
import { initHmr } from '@frlow/brine/client/hmr'
;(async () => {
  const apps = [
    import('./vanilla'),
    import('./react'),
    import('./vue'),
    import('./svelte'),
  ]

  const wrappers = await Promise.all(
    apps.map(async (appImport) => {
      const app = await appImport
      const wrapper = createWrapper(app.default)
      const transplantableWrapper = createTransplantableWrapper(wrapper)
      defineComponent(transplantableWrapper)
      return transplantableWrapper
    })
  )
  initHmr(wrappers)
})()

export {}
