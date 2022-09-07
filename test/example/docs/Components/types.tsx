import React, { ReactNode } from 'react'

type NodeInfo = {
  type?: string
  tag?: string
  props?: { [i: string]: any }
  emits?: string[]
  children?: NodeInfo[]
}
const getInfo = (node: ReactNode, prefix: string): NodeInfo[] => {
  const elements = (Array.isArray(node) ? node : [node]) as any[]
  return elements.map((el) => {
    const { children, ...propValues } = el.props || {}
    const props = Object.fromEntries(
      Object.entries(propValues).filter(([key]) => !key.match(/on[A-Z]/))
    )
    const emits = Object.keys(propValues).filter((key) => key.match(/on[A-Z]/))
    return {
      tag: el.type.name ? undefined : el.type,
      type: el.type.name ? el.type.name : undefined,
      props: Object.keys(props).length > 0 ? props : undefined,
      emits: emits.length > 0 ? emits : undefined,
      children: children ? getInfo(children, prefix) : undefined,
    }
  })
}

const CreateExample =
  (prefix: string) =>
  ({ children }: { children: ReactNode }) => {
    const info = getInfo(children, prefix)
    return (
      <div style={{ border: '1px solid red' }}>
        {children}
        <div style={{ border: '1px dotted white' }}>{JSON.stringify(info)}</div>
      </div>
    )
  }

export const Example = CreateExample('ex')

export const ReactBool = ({
  enable,
  onClick,
}: {
  enable?: boolean
  onClick?: boolean
}) => {
  return <ex-react-bool enable={enable}></ex-react-bool>
}
