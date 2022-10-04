import React, { useEffect } from 'react'

export default ({ code, info }: { code: any; info: any }) => {
  useEffect(() => {
    document.title = 'This is my awesome component library'
  })
  return <h1 style={{ margin: '0.5rem' }}>My Component library</h1>
}
