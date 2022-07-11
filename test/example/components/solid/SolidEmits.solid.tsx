export default (props: {
  onStringevent: (val: string) => void
  onNumevent: (val: number) => void
  onObjevent: (val: { value: string }) => void
  onClick: () => void
}) => {
  return (
    <button
      onClick={() => {
        props.onStringevent('demo')
        props.onNumevent(5)
        props.onObjevent({ value: 'val' })
        props.onClick()
      }}
    >
      Solid Send event
    </button>
  )
}
