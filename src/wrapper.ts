import { createComponent } from '@lit-labs/react'
import React from 'react'
import { kebabize } from './utils/kebab.js'

export const wrapWc =
  <T>(tag: string) =>
  (args: T): JSX.Element => {
    const events = Object.keys(args)
      .filter((d) => /on[A-Z]/.test(d))
      .reduce(
        (acc, cur) => ({ ...acc, [cur]: kebabize(cur).replace('on-', '') }),
        {}
      )

    const Wrapper = createComponent({
      tagName: tag,
      elementClass: customElements.get(tag),
      react: React,
      events,
    })

    return React.createElement(Wrapper, args) as any
  }
