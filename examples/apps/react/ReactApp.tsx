import './ReactApp.css'
import React from 'react'
import { MyTester } from './Wrappers'

export default ({ count }: { count: number }) => {
  return (
    <div>
      <h3 className="color">React {count + 1}</h3>
      <MyTester
        obj={{ value: 4 }}
        text="react"
        onMyEvent={(ev) => console.log(ev)}
      ></MyTester>
    </div>
  )
}
