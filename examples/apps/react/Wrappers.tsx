import React from 'react'
import { wrapWc } from 'brinejs/wrapper'

export const MyTester = wrapWc<{
  text: string
  obj: { value: number }
  onMyEvent: (ev: CustomEvent<string>) => void
}>('my-tester', ['my-event'])
