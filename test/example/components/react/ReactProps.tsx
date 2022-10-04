import React from 'react'

export default ({
  stringprop,
  numprop,
  complexprop,
  selectprop,
  optionalprop,
}: {
  stringprop: string
  numprop: number
  complexprop: { value: string }
  selectprop: 'a' | 'b'
  optionalprop?: string
}) => {
  return (
    <div>
      <div className="stringprop">{stringprop}</div>
      <div className="numprop">{numprop + 1}</div>
      <div className="complexprop">{complexprop?.value}</div>
      <div className="selectprop">{selectprop}</div>
      <div className="optionalprop">{optionalprop || 'default'}</div>
    </div>
  )
}
