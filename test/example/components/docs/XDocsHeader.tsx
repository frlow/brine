import React, { useEffect } from 'react'

export default ({ code, info }: { code: any; info: any }) => {
  useEffect(() => {
    document.title = 'This is my awesome component library'
  })
  return <div>Header</div>
}
