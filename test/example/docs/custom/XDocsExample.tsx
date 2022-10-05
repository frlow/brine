import React, { useState } from 'react'

export default ({
  code,
  info,
}: {
  code: { [i: string]: string }
  info: any
}) => {
  const [showCode, setShowCode] = useState(false)
  const [fw, setFw] = useState('vue')
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <slot></slot>
      <button onClick={() => setShowCode(!showCode)} style={{ width: '150px' }}>
        Show Code
      </button>
      {showCode && <div style={{ whiteSpace: 'pre-wrap' }}>{code[fw]}</div>}
    </div>
  )
}
