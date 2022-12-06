import { buildApp, testWrapper } from './common.test.js'
import { createOptions } from './svelte'
import type { Plugin } from 'esbuild'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'

const plugins: Plugin[] = [
  (sveltePlugin as any)({
    preprocess: (sveltePreprocess as any)(),
  }),
]
describe('svelte', () => {
  testWrapper(
    createOptions,
    {
      stringText: `<div>simple-string-text</div>`,
      stringProp: `<div>{text}</div><script>export let text</script>`,
      numProp: `<div>{num+1}</div><script>export let num</script>`,
      objProp: `<div>{obj.val}</div><script>export let obj</script>`,
      onMountProps: `<script>import {onMount} from 'svelte'; onMount(() => console.log(text)); export let text</script>`,
      simpleEvent: `<script>import {createEventDispatcher} from 'svelte'; const d = createEventDispatcher()</script>
                    <button id="button" on:click={()=>d("my-event","simple")}></button>`,
    },
    plugins,
    '.svelte'
  )
})
