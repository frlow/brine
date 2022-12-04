import { testAnalyzer } from './common.test.js'
import { analyzeSvelteFile } from './svelte.js'

describe('svelte', () => {
  testAnalyzer(analyzeSvelteFile, {
    name: { fileName: 'MyApp.svelte', code: `<div></div>` },
    stringProp: `<script lang="ts">export let str: string</script>`,
    numberProp: `<script lang="ts">export let num: number</script>`,
    objectProp: `<script lang="ts">export let obj: {val:string}</script>`,
    literalProp: `<script lang="ts">export let literal: 'a'|'b'</script>`,
    optionalProp: `<script lang="ts">export let optional: string="value"</script>`,
    multipleProps: `<script lang="ts">export let a:string;export let b:number</script>`,
    camelNameProp: `<script lang="ts">export let camelName: string</script>`,
    kebabNameProp: null,
    exoticNameProp: `<script lang="ts">export let ex0t_ic: string</script>`,
  })
})
