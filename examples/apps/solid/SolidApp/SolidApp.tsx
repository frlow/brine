import './SolidApp.css'
import {} from 'solid-js'

export default (props: {
  count: number
  onMyEvent: () => void
  myProp: number
}) => {
  return (
    <div>
      <h3 class="color">Solid {props.count + 1}</h3>
      <my-tester
        obj={{ val: 4 }}
        text={`solid ${props.count}`}
        on:my-event={(ev: any) => console.log(ev)}
        my-prop={{ prop: 'SolidProp' }}
      ></my-tester>
    </div>
  )
}
