import React from 'react'
import { SvelteEmits } from '../../dist/wrapper/react/SvelteEmits.lite'

export default () => {
  const [count, setCount] = React.useState(0)
  return (
    <div id={'test'}>
      <SvelteEmits onClick={() => setCount(count + 1)}>Increment</SvelteEmits>
      <div id={'count'}>{count}</div>
    </div>
  )
}
