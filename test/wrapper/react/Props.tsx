import React from 'react'
import { SvelteProps } from '../../dist/wrapper/react'

export default () => {
  return (
    <div id={'test'}>
      <SvelteProps
        stringprop={'str'}
        numprop={6}
        complexprop={{ value: 'val' }}
      ></SvelteProps>
    </div>
  )
}
