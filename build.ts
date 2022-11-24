import esbuild, { Plugin } from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue3'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import path from 'path'
import {
  autoIndexFilePlugin,
  FilePluginOptions,
  injectCssPlugin,
  typesDocsPlugin,
} from './build/plugin'
import aliasPlugin from 'esbuild-plugin-alias'
import { hotReloadPlugin } from './build/plugin/hotReload'
import { metaPlugin } from './build/plugin/metaPlugin'

const svelteApp = 'examples/svelte/SvelteApp.svelte'
const vueApp = 'examples/vue/VueApp.vue'
const reactApp = 'examples/react/ReactApp.tsx'

const indexFiles = [
  path.parse(reactApp).dir + '/index.ts',
  path.parse(vueApp).dir + '/index.ts',
  path.parse(svelteApp).dir + '/index.ts',
  'examples/vanilla/index.ts',
]

const autoIndexFiles: FilePluginOptions[] = [
  { path: reactApp, framework: 'react' },
  { path: svelteApp, framework: 'svelte' },
  { path: vueApp, framework: 'vue' },
]

const outbase = 'examples'
const outdir = 'dist'
const prefix = 'my'

const dev = process.argv[2] === 'watch'
esbuild
  .build({
    entryPoints: indexFiles,
    format: 'esm',
    outdir: outdir,
    outbase,
    bundle: true,
    sourcemap: true,
    splitting: true,
    minify: !dev,
    define: { 'process.env.NODE_ENV': dev ? "'development'" : '"production"' },
    plugins: [
      vuePlugin() as Plugin,
      sveltePlugin({
        preprocess: [sveltePreprocess()],
      }),
      autoIndexFilePlugin(autoIndexFiles, prefix, dev),
      injectCssPlugin(),
      typesDocsPlugin(autoIndexFiles, prefix),
      hotReloadPlugin(['/dist/vanilla/index.js', '/dist/vue/index.js'], dev),
      metaPlugin(dev),

      // This is just for local dev
      aliasPlugin({
        '@frlow/brine/client': './client',
      }),
    ],
    watch: dev,
    write: false,
    metafile: true,
  })
  .then()
