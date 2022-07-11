export default (props: { enable?: boolean }) => {
  return <div>{props.enable ? 'Enabled' : 'Disabled'}</div>
}
