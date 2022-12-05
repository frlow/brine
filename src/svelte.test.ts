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
  testWrapper({
    stringText: async () =>
      createOptions(
        await buildApp(`<div>text</div>`, 'StringTextApp.svelte', plugins),
        {
          tag: 'test-string-text',
          style: '',
          attributes: [],
          emits: [],
        }
      ),
  })
})
