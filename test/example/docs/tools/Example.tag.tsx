import React from 'react'
import { ExampleArgs } from '../../../dist/DocsTypes'

export const DocsExample = ({ children, code, info }: ExampleArgs) => (
  <div x-data="{ show: false }">
    <div
      style={{
        border: '1px solid blue',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {children}
    </div>
    <div style={{ border: '1px solid lightblue', padding: '1rem' }}>
      <button x-on:click="show=!show">Toggle Code</button>
      <template x-if="show">
        <div>
          {['Vue', 'React'].map((fw) => (
            <p key={fw}>
              <div>{fw}:</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {code[fw.toLowerCase()]}
              </div>
            </p>
          ))}
        </div>
      </template>
    </div>
  </div>
)
