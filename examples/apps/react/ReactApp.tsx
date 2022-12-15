import './ReactApp.css'
import React from 'react'
import { Tester, VueApp } from 'react-wrapper'

export default ({ count }: { count: number }) => {
  return (
    <div>
      <h3 className="color">React {count + 1}</h3>
      <Tester
        obj={{ val: 4 }}
        text="react"
        onMyEvent={(ev) => console.log(ev)}
      ></Tester>
    </div>
  )
}
