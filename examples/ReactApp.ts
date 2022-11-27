import { createWrapper, defineComponent } from '@frlow/brine/client/react'
import options from './react'
import { createTransplantableWrapper } from '@frlow/brine/client/transplantExtension'

defineComponent(createTransplantableWrapper(createWrapper(options)))
