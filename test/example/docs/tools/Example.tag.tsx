import React from 'react'
import { ExampleArgs } from '../../../dist/DocsTypes'

export const DocsExample = ({ children, code, info }: ExampleArgs) => (
  <div x-data="{ show: false }">
    <div style={{ border: '1px solid blue', padding: '1rem' }}>{children}</div>
    <div style={{ border: '1px solid lightblue', padding: '1rem' }}>
      <button x-on:click="show=!show">Toggle Code</button>
      <template x-if="show">
        <div>
          <p>
            <div>Vue:</div>
            <div>{code.vue}</div>
          </p>
          <p>
            <div>React:</div>
            <div>{code.react}</div>
          </p>
          <p>
            <div>Structure:</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(info, null, 2)}
            </div>
          </p>
        </div>
      </template>
    </div>
  </div>
)
