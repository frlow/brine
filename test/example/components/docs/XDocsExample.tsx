import React, { useState } from 'react'

export default ({ code, info }: { code: any; info: any }) => {
  const [showCode, setShowCode] = useState(false)
  const [fw, setFw] = useState('vue')
  return (
    <div>
      <slot></slot>
      {/*<button onClick={() => setShowCode(!showCode)}>Show Code</button>*/}
      {/*{showCode && <div style={{ whiteSpace: 'pre-wrap' }}>{code[fw]}</div>}*/}
    </div>
  )
}
