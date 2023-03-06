import './SolidApp.css'
import {} from 'solid-js'

export default function (props: {
  count: number
  onMyEvent: () => void
  myProp: number
}) {
  return (
    <div>
      <h3 class="color">Solid {props.count + 1}</h3>
      <my-tester
        obj={{ val: 4 }}
        text={`solid ${props.count}`}
        on:my-event={(ev: any) => {
          console.log(ev)
          props.onMyEvent(ev)
        }}
        my-prop={{ prop: 'SolidProp' }}
      ></my-tester>
    </div>
  )
}
// SolidApp.__props = ['count', 'my-prop']
