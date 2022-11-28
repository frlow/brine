import esbuild, { analyzeMetafile, Plugin } from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue3'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import glob from 'glob'
import { hotReloadPlugin, injectCssPlugin, metaPlugin } from './build/plugin'
import aliasPlugin from 'esbuild-plugin-alias'
import path from 'path'

const outbase = 'examples'
const outdir = 'dist'

const dev = process.argv[2] === 'watch'
// const entryPoints = glob.sync('examples/*App.ts')
const entryPoints = glob
  .sync('examples/**/index.ts')
  .concat('examples/dynamic.ts')
// const entryPoints = ['examples/dev.ts']
// const entryPoints = ['examples/prod.ts']
// const entryPoints = dev ? ['examples/dev.ts'] : ['examples/prod.ts']
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
      injectCssPlugin(),
      hotReloadPlugin(dev, path.resolve('.')),
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
  .then(async (result) => {
    if (!dev) {
      console.log(await analyzeMetafile(result.metafile))
    }
  })
