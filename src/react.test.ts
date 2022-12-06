import { testWrapper } from './common.test.js'
import { createOptions } from './react.js'

describe('react', () => {
  testWrapper(
    createOptions,
    {
      stringText: `import React from 'react'; export default ()=><div>simple-string-text</div>`,
    },
    [],
    '.tsx',
    './src/tsconfig.test.react.json'
  )
})
