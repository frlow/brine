import React from 'react'
import { SvelteEmits } from '../../dist/wrapper/react/SvelteEmits.lite'

export default () => {
  const log = (e: any) => (window as any).log.push(e)
  return (
    <div id={'test'}>
      <SvelteEmits
        onStringevent={(e) => log(e)}
        onClick={(e) => log(e)}
        onNumevent={(e) => log(e)}
        onObjevent={(e) => log(e)}
      ></SvelteEmits>
    </div>
  )
}
