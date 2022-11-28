import { createWrapper, defineComponent } from '@frlow/brine/client/react'
import options from './react'
import { initHmr } from '@frlow/brine/client/hmr'
import { createTransplantableWrapper } from '@frlow/brine/client/extensions/transplant'

const wrapper = createTransplantableWrapper(createWrapper(options))
initHmr([wrapper], { force: true })
defineComponent(wrapper)
export default options
