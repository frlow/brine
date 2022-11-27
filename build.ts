import esbuild, { analyzeMetafile, Plugin } from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue3'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import glob from 'glob'
import { injectCssPlugin } from './build/plugin'
import aliasPlugin from 'esbuild-plugin-alias'

const outbase = 'examples'
const outdir = 'dist'

const entryPoints = glob.sync('examples/*App.ts')
// const entryPoints = ['examples/index.ts']

const dev = process.argv[2] === 'watch'
esbuild
  .build({
    entryPoints,
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
      // autoIndexFilePlugin(autoIndexFiles, prefix, dev),
      injectCssPlugin(),
      // typesDocsPlugin(autoIndexFiles, prefix),
      // hotReloadPlugin(['/dist/vanilla/index.js', '/dist/vue/index.js'], dev),
      // metaPlugin(dev),

      // This is just for local dev
      aliasPlugin({
        '@frlow/brine/client': './client',
      }),
    ],
    watch: dev,
    write: false,
    metafile: true,
  })
  .then(async (result) => {
    if (!dev) {
      console.log(await analyzeMetafile(result.metafile))
    }
  })
