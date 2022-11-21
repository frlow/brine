import './index.css'
import { useEffect } from 'react'

export const App = ({
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
      <button className="button" onClick={() => onMyEvent('react-demo')}>
        Button
      </button>
      <slot name="foo"></slot>
      <slot></slot>
    </div>
  )
}
