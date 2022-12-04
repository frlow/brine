import { testAnalyzer } from './common.test.js'
import { analyzeJsxFile } from './jsx.js'

describe('jsx', () => {
  testAnalyzer(analyzeJsxFile, {
    name: { fileName: 'MyApp.tsx', code: `export default ()=>{}` },
    stringProp: `export default (args: {str: string})=>{}`,
    numberProp: `export default (args: {num: number})=>{}`,
    objectProp: `export default (args: {obj: {val:string}})=>{}`,
    literalProp: `export default (args: {literal: 'a'|'b'})=>{}`,
    optionalProp: `export default (args: {optional?: string})=>{}`,
    multipleProps: `export default (args: {a: string, b: number})=>{}`,
    camelNameProp: `export default (args: {camelName: string})=>{}`,
    kebabNameProp: `export default (args: {"kebab-name": string})=>{}`,
    exoticNameProp: `export default (args: {ex0t_ic: string})=>{}`,
    stringEmit: `export default (args: {onStr: (arg: string)=>void})=>{}`,
    numberEmit: `export default (args: {onNum: (arg: number)=>void})=>{}`,
    objectEmit: `export default (args: {onObj: (arg: {val:string}})=>void})=>{}`,
    literalEmit: `export default (args: {onLiteral: (arg: 'a'|'b')=>void})=>{}`,
    optionalEmit: `export default (args: {onOptional?: (arg: string)=>void})=>{}`,
    multipleEmits: `export default (args: {onA: (arg: string)=>void,onB: (arg: number)=>void})=>{}`,
    camelNameEmit: `export default (args: {onCamelName: (arg: string)=>void})=>{}`,
    kebabNameEmit: `export default (args: {"onKebab-name": (arg: string)=>void})=>{}`,
    exoticNameEmit: `export default (args: {onEx0t_ic: (arg: string)=>void})=>{}`,
    noSlots: `export default ()=>{return <></>}`,
    defaultSlot: `export default ()=>{return <><slot></slot></>}`,
    namedSlot: `export default ()=>{return <><slot name="named"></slot></>}`,
    multipleNamedSlots: `export default ()=>{return <><slot name="a"></slot><slot name="b"></slot></>}`,
  })
})
