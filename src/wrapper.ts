import { createComponent } from '@lit-labs/react'
import React from 'react'
import { camelize, kebabize } from './common.js'

export const wrapWc = <T>(tag: string, events: string[]) => {
  const wrapper = {
    instance: undefined as any,
    get value() {
      if (!this.instance) {
        const elementClass = customElements.get(tag)
        if (!elementClass) return undefined
        const eventNames = events.reduce(
          (acc, cur) => ({ ...acc, [camelize(`on-${cur}`)]: cur }),
          {}
        )
        this.instance = createComponent({
          tagName: tag,
          elementClass,
          react: React,
          events: eventNames,
        })
      }
      return this.instance
    },
  }

  return (args: T): JSX.Element => {
    const wrapperValue = wrapper.value
    const props = Object.entries(args).reduce((acc, [key, value]) => {
      if (/on[A-Z]/.test(key)) acc[key] = value
      else acc[kebabize(key)] = value
      return acc
    }, {} as any)
    return wrapperValue
      ? (React.createElement(wrapper.value, props) as any)
      : null
  }
}
