import { testWrapper } from './common.test.js'
import { createOptions } from './solid.js'
import { solidPlugin } from 'esbuild-plugin-solid'
import { jsxPlugin } from '../examples/jsxPlugin'

const i = `import {onMount} from 'solid-js'
export default `
describe('solid', () => {
  testWrapper(
    createOptions,
    {
      stringText: `${i}()=><div>simple-string-text</div>`,
      stringProp: `${i}(props)=><div>{props.text}</div>`,
      numProp: `${i}(props)=><div>{props.num+1}</div>`,
      objProp: `${i}(props)=><div>{props.obj.val}</div>`,
      onMountProps: `${i}(props)=>{onMount(async ()=>console.log(props.text));return <p/>}`,
      simpleEvent: `${i}(props)=><button id="button" onClick={()=>props.onMyEvent('simple')}/>`,
      openClosed: `${i}()=><div>open-closed</div>`,
    },
    [jsxPlugin],
    ['solid-js'],
    '.tsx',
    './src/tsconfig.test.solid.json'
  )
})
