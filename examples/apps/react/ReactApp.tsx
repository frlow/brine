import './ReactApp.css'
import React from 'react'
import { Tester } from 'react-wrapper'

export default ({ count }: { count: number }) => {
  return (
    <div>
      <h3 className="color">React {count + 1}</h3>
      <Tester
        obj={{ val: 4 }}
        text={`react ${count}`}
        onMyEvent={(ev) => console.log(ev)}
        myProp={{ prop: 'ReactProp' }}
      ></Tester>
    </div>
  )
}
