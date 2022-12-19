import { createComponent } from '@lit-labs/react'
import React from 'react'
import { camelize } from './utils/kebab.js'

export const wrapWc = <T>(tag: string, events: string[]) => {
  const wrapper = {
    instance: undefined as any,
    get value() {
      if (!this.instance) {
        const eventNames = events.reduce(
          (acc, cur) => ({ ...acc, [camelize(`on-${cur}`)]: cur }),
          {}
        )

        this.instance = createComponent({
          tagName: tag,
          elementClass: customElements.get(tag),
          react: React,
          events: eventNames,
        })
      }
      return this.instance
    },
  }

  return (args: T): JSX.Element => {
    return React.createElement(wrapper.value, args) as any
  }
}
