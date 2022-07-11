import type { Complex } from '../types'

export default (props: {
  stringprop: string
  numprop: number
  complexprop: Complex
  optionalprop?: string
}) => {
  return (
    <div>
      <div className="stringprop">{props.stringprop}</div>
      <div className="numprop">{props.numprop + 1}</div>
      <div className="complexprop">{props.complexprop?.value}</div>
      <div className="optionalprop">{props.optionalprop || 'default'}</div>
    </div>
  )
}
