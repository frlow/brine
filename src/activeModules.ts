import { ElementsModule, WrapperModule } from './modules/Module'
import { svelteElementsModule } from './modules/svelte'
import { vueElementsModule, vueWrapperModule } from './modules/vue'
import { reactElementsModule, reactWrapperModule } from './modules/react'
import { solidElementsModule } from './modules/solid'
import { litElementsModule } from './modules/lit'

export const elementsModules: ElementsModule[] = [
  svelteElementsModule,
  vueElementsModule,
  reactElementsModule,
  solidElementsModule,
  // litElementsModule,
]
export const wrapperModules: WrapperModule[] = [
  vueWrapperModule,
  reactWrapperModule,
  // svelteWrapperModule
]
