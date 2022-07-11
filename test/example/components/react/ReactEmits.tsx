import React from 'react'

export default (
  {
    onStringevent,
    onClick,
    onObjevent,
    onNumevent,
  }: {
    onStringevent: (val: string) => void
    onNumevent: (val: number) => void
    onObjevent: (val: { value: string }) => void
    onClick: () => void,
  }) => {
  return (
    <button
      onClick={() => {
        onStringevent('demo')
        onNumevent(5)
        onObjevent({value: 'val'})
        onClick()
      }}
    >
      React Send event
    </button>
  )
}
