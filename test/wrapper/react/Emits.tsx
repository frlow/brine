import React from 'react'
import { SvelteEmits } from '../../dist/wrapper/react'

export default () => {
  const log = (window as any).log as (msg: any) => void
  return (
    <div id={'test'}>
      <SvelteEmits
        onStringevent={log}
        onClick={log}
        onNumevent={log}
        onObjevent={log}
      ></SvelteEmits>
    </div>
  )
}
