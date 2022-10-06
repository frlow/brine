import React, { useState } from 'react'

export default ({
  code,
  info,
}: {
  code: { [i: string]: string }
  info: any
}) => {
  const [showCode, setShowCode] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <slot></slot>

      <button
        onClick={() => setShowCode(!showCode)}
        style={{
          border: 'none',
          backgroundColor: '#333333',
          color: 'white',
          fontFamily: 'Avenir',
          height: '30px',
        }}
      >
        Show Code
      </button>
      {showCode && <slot name="code"></slot>}
    </div>
  )
}
