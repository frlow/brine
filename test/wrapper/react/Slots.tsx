import React from 'react'
import { SvelteSlots, SvelteSimple } from '../../dist/wrapper/react'

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
