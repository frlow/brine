import React from 'react'

export default ({ enable }: { enable?: boolean }) => {
  return <div>{enable ? 'Enabled' : 'Disabled'}</div>
}
