import { createWrapper, defineComponent } from '@frlow/brine/lib/client/index'
import { options } from './apps/svelte'

defineComponent(createWrapper(options))
