import './ReactApp.css'
import React from 'react'

export default ({ count }: { count: number }) => {
  return (
    <div>
      <h3 className="color">React {count + 1}</h3>
      <my-tester
        obj={{ val: 4 }}
        text={`react ${count}`}
        onmy-event={(ev: any) => console.log(ev)}
        my-prop={{ prop: 'ReactProp' }}
      ></my-tester>
    </div>
  )
}
