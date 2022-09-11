import React from 'react'
import { SvelteEmits } from '../../dist/lite-wrapper/react/SvelteEmits'

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
