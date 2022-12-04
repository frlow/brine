import React, { CSSProperties, ReactNode, useEffect, useRef } from 'react'
import { kebabize } from './utils/kebab.js'

export const filterProps = <T extends { [i: string]: any }>(
  obj: T,
  filter: (key: string, value: any) => boolean,
  modify?: (key: string, value: any) => any
): Partial<T> =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (filter(key, value)) acc[key] = modify ? modify(key, value) : value
    return acc
  }, {} as any)

type StandardArgs = {
  children?: ReactNode
  style?: CSSProperties
  slot?: string
}
const ignoredProps = ['children']

export const wrapWc =
  <T extends { [i: string]: any }>(tag: string) =>
  (args: T & StandardArgs): JSX.Element => {
    const ref = useRef<HTMLElement>(null)
    const props = filterProps(
      args,
      (key, value) =>
        typeof value !== 'function' && !ignoredProps.includes(key),
      (key, value) =>
        typeof value === 'string' ? value : JSON.stringify(value)
    )
    const functions = filterProps(
      args,
      (key, value) => typeof value === 'function' && !!key.match(/^on[A-Z]/)
    )
    useEffect(() => {
      const handlers = Object.entries(functions).map(([funcKey, func]) => ({
        key: kebabize(funcKey.replace(/^on([A-Z])/, '$1')),
        func: (e: any) => func(e.detail),
      }))
      handlers.forEach((h) => ref.current?.addEventListener(h.key, h.func))
      return () =>
        handlers.forEach((h) => ref.current?.removeEventListener(h.key, h.func))
    })
    const Component: (args: any) => JSX.Element = tag as any
    return React.createElement(
      Component,
      { ...props, ref: ref },
      args.children
    ) as JSX.Element
  }
