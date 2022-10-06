import React from 'react'
import github from './github.png'

export default () => {
  return (
    <div>
      <a
        style={{
          justifyContent: 'center',
          display: 'flex',
          height: '30px',
          opacity: '0.5',
          margin: '1rem',
        }}
        href={'https://github.com/frlow/brine'}
      >
        <img src={github} alt="github" />
      </a>
    </div>
  )
}
