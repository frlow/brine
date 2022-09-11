import React from 'react'
import { SvelteSlots } from '../../dist/lite-wrapper/react/SvelteSlots'
import { SvelteSimple } from '../../dist/lite-wrapper/react/SvelteSimple'

export default () => {
  return (
    <div id={'test'}>
      <SvelteSlots>
        <SvelteSimple></SvelteSimple>
        <SvelteSimple slot={'named'}></SvelteSimple>
      </SvelteSlots>
    </div>
  )
}
