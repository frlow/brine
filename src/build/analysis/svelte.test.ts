import { testAnalyzer } from './common.test.js'
import { analyzeSvelteFile } from './svelte.js'

describe('svelte', () => {
  testAnalyzer(
    analyzeSvelteFile,
    {
      name: `<div></div>`,
      stringProp: `<script lang="ts">export let str: string</script>`,
      numberProp: `<script lang="ts">export let num: number</script>`,
      objectProp: `<script lang="ts">export let obj: {val:string}</script>`,
      literalProp: `<script lang="ts">export let literal: 'a'|'b'</script>`,
      optionalProp: `<script lang="ts">export let optional: string="value"</script>`,
      multipleProps: `<script lang="ts">export let a:string;export let b:number</script>`,
      camelNameProp: `<script lang="ts">export let camelName: string</script>`,
      kebabNameProp: null,
      exoticNameProp: `<script lang="ts">export let ex0t_ic: string</script>`,
      stringEmit: `<script lang="ts">const d = createEventDispatcher<{str:string}>()</script>`,
      numberEmit: `<script lang="ts">const d = createEventDispatcher<{num:number}>()</script>`,
      objectEmit: `<script lang="ts">const d = createEventDispatcher<{obj:{val:string}}>()</script>`,
      literalEmit: `<script lang="ts">const d = createEventDispatcher<{literal:'a'|'b'}>()</script>`,
      multipleEmits: `<script lang="ts">const d = createEventDispatcher<{a:string,b:number}>()</script>`,
      camelNameEmit: `<script lang="ts">const d = createEventDispatcher<{camelName: string}>()</script>`,
      kebabNameEmit: `<script lang="ts">const d = createEventDispatcher<{"kebab-name": string}>()</script>`,
      exoticNameEmit: `<script lang="ts">const d = createEventDispatcher<{ex0t_ic: string}>()</script>`,
      noSlots: `<div></div>`,
      defaultSlot: `<div><svelte:element this="slot"/></div>`,
      namedSlot: `<div><svelte:element this="slot" name="named"/></div>`,
      multipleNamedSlots: `<div><svelte:element this="slot" name="a"/><svelte:element this="slot" name="b"/></div>`,
    },
    'MyApp.svelte'
  )
})
