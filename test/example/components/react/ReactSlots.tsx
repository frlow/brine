import React, { ReactNode } from 'react'

const boxStyle = {
  border: '1px solid red',
}

export default ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <div style={boxStyle}>
        <h5>Default</h5>
        <slot></slot>
      </div>
      <div style={boxStyle}>
        <h5>Named</h5>
        <slot name="named"></slot>
      </div>
    </div>
  )
}
