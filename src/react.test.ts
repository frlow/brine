import { testWrapper } from './common.test.js'
import { createOptions } from './react.js'

const i = "import React from 'react'; export default "
describe('react', () => {
  testWrapper(
    createOptions,
    {
      stringText: `${i}()=><div>simple-string-text</div>`,
      stringProp: `${i}({text})=><div>{text}</div>`,
      numProp: `${i}({num})=><div>{num+1}</div>`,
      objProp: `${i}({obj})=><div>{obj.val}</div>`,
      onMountProps: `${i}({text})=>{console.log(text);return <p/>}`,
      simpleEvent: `${i}({onMyEvent})=><button id="button" onClick={()=>onMyEvent('simple')}/>`,
    },
    [],
    '.tsx',
    './src/tsconfig.test.react.json'
  )
})
