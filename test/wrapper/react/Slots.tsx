import React from 'react'
import { SvelteSlots } from '../../dist/wrapper/react/SvelteSlots'
import { SvelteSimple } from '../../dist/wrapper/react/SvelteSimple'

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
