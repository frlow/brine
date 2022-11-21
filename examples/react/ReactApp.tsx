import './index.css'
import React, {useEffect} from 'react'

export default (
  {
    count,
    text,
    obj,
    onMyEvent,
  }: {
    count: number
    text: string
    obj: { val: string }
    onMyEvent: (text: string) => void
  }) => {
  useEffect(() => {
    console.log('React Mount')
    return () => {
      console.log('React unmount')
    }
  })
  return (
    <div>
      <div>React</div>
      <div>
        {count} {text} {obj?.val}
      </div>
      <button class="button" onClick={() => onMyEvent('react-demo')}>
        Button
      </button>
      <slot name="foo"></slot>
      <slot></slot>
    </div>
  )
}
