import { createComponent } from '@lit-labs/react'
import React from 'react'
import { camelize, kebabize } from './utils/kebab.js'

export const wrapWc = <T>(tag: string, events: string[]) =>
  createComponent({
    tagName: tag,
    elementClass: customElements.get(tag),
    react: React,
    events: events.reduce(
      (acc, cur) => ({ ...acc, [camelize(`on-${cur}`)]: kebabize(cur) }),
      {}
    ),
  }) as unknown as (args: T) => JSX.Element
