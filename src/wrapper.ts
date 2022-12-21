import { createComponent } from '@lit-labs/react'
import React from 'react'
import { camelize } from './common.js'

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
    return wrapperValue
      ? (React.createElement(wrapper.value, args) as any)
      : null
  }
}
