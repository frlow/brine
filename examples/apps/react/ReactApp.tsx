import './ReactApp.css'
import React from 'react'
import { VueApp } from 'react-wrapper'

export default ({ count }: { count: number }) => {
  return (
    <div>
      <h3 className="color">React {count + 1}</h3>
      <VueApp count={count} onMyEvent={(ev) => console.log(ev)}></VueApp>
    </div>
  )
}
