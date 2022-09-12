const boxStyle = {
  border: '1px solid red',
}

export default (props: { children: JSX.Element }) => {
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
