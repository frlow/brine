import { ElementsModule, WrapperModule } from './modules/Module'
import { svelteElementsModule } from './modules/svelte'
import { vueElementsModule, vueWrapperModule } from './modules/vue'
import { reactElementsModule, reactWrapperModule } from './modules/react'
import { solidElementsModule } from './modules/solid'

export const elementsModules: ElementsModule[] = [
  svelteElementsModule,
  vueElementsModule,
  reactElementsModule,
  solidElementsModule,
]
export const wrapperModules: WrapperModule[] = [
  vueWrapperModule,
  reactWrapperModule,
  // svelteWrapperModule
]
