import './ReactApp.css'
import React from 'react'

export default ({
  count,
  onMyEvent,
}: {
  count: number
  onMyEvent: (ev: any) => void
}) => {
  return (
    <div>
      <h3 className="color">React {count + 1}</h3>
      <my-tester
        obj={{ val: 4 }}
        text={`react ${count}`}
        onmy-event={(ev: any) => {
          console.log(ev)
          onMyEvent(ev)
        }}
        my-prop={{ prop: 'ReactProp' }}
      ></my-tester>
    </div>
  )
}
