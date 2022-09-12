import React from 'react'

export default ({
  stringprop,
  numprop,
  complexprop,
  optionalprop,
}: {
  stringprop: string
  numprop: number
  complexprop: { value: string }
  optionalprop?: string
}) => {
  return (
    <div>
      <div className="stringprop">{stringprop}</div>
      <div className="numprop">{numprop + 1}</div>
      <div className="complexprop">{complexprop?.value}</div>
      <div className="optionalprop">{optionalprop || 'default'}</div>
    </div>
  )
}
