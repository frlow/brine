import React from 'react'
import { SvelteSlots } from '../../dist/wrapper/react/SvelteSlots.lite'
import { SvelteSimple } from '../../dist/wrapper/react/SvelteSimple.lite'

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
