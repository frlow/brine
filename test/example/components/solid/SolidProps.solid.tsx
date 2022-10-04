export default (props: {
  stringprop: string
  numprop: number
  complexprop: { value: string }
  selectprop: 'a' | 'b'
  optionalprop?: string
}) => {
  return (
    <div>
      <div class="stringprop">{props.stringprop}</div>
      <div class="numprop">{props.numprop + 1}</div>
      <div class="complexprop">{props.complexprop?.value}</div>
      <div class="selectprop">{props.selectprop}</div>
      <div class="optionalprop">{props.optionalprop || 'default'}</div>
    </div>
  )
}
