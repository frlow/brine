import esbuild, { Plugin } from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue3'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import path from 'path'
import {
  autoIndexFilePlugin,
  AutoIndexFilePluginOptions,
} from './build/plugin/autoIndexFile'
import { injectCssPlugin } from './build/plugin/cssInject'
import aliasPlugin from 'esbuild-plugin-alias'

const svelteApp = 'examples/svelte/SvelteApp.svelte'
const vueApp = 'examples/vue/VueApp.vue'
const reactApp = 'examples/react/ReactApp.tsx'

const indexFiles = [
  path.parse(reactApp).dir + '/index.ts',
  path.parse(vueApp).dir + '/index.ts',
  path.parse(svelteApp).dir + '/index.ts',
  'examples/vanilla/index.ts',
]

const autoIndexFiles: AutoIndexFilePluginOptions[] = [
  { path: reactApp, framework: 'react' },
  { path: svelteApp, framework: 'svelte' },
  { path: vueApp, framework: 'vue' },
]

const outbase = 'examples'
const outdir = 'dist'
const prefix = 'my'

const dev = process.argv[2] === 'watch'
// writeAutoIndexFiles(autoIndexFiles, 'my')
esbuild
  .build({
    entryPoints: indexFiles,
    format: 'esm',
    outdir: outdir,
    outbase,
    bundle: true,
    sourcemap: true,
    splitting: true,
    define: { 'process.env.NODE_ENV': '"production"' },
    plugins: [
      vuePlugin() as Plugin,
      sveltePlugin({
        preprocess: [sveltePreprocess()],
      }),
      autoIndexFilePlugin(autoIndexFiles, prefix),
      injectCssPlugin(),

      // This is just for local dev
      aliasPlugin({
        '@frlow/brine/client': './client',
      }),
    ],
    watch: dev,
    write: false,
  })
  .then()
