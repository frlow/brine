import React, { useEffect, useRef, useState } from 'react'

export default () => {
  const updateInner = () => {
    const name = decodeURIComponent(window.location.hash.replace('#', ''))
    const host = (mainRef.current!.getRootNode() as any).host as HTMLElement
    const children = Array.from(host.childNodes!)
    const child = (children.find((e: any) => e.id === name) ||
      children[0]) as HTMLElement
    setEl(child)
  }
  useEffect(() => {
    window.addEventListener('hashchange', (e) => {
      updateInner()
    })
    updateInner()
  })

  const [el, setEl] = useState<HTMLElement>()

  const mainRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={mainRef}
      // dangerouslySetInnerHTML={{ __html: el?.innerHTML || '' }}
    >
      <slot></slot>
    </div>
  )
}
