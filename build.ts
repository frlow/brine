import esbuild, { analyzeMetafile, Plugin } from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue3'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import glob from 'glob'
import { hotReloadPlugin, injectCssPlugin } from './build/plugin'
import aliasPlugin from 'esbuild-plugin-alias'
import path from 'path'
import { writeIndexFile } from './build/analysis'
import { writeMetaFile } from './build/analysis/metaFile'
import { beforePlugin } from './build/plugin/before'
;(async () => {
  const outbase = 'examples'
  const outdir = 'dist'
  const dev = process.argv[2] === 'watch'
  const entryPoints = glob.sync('examples/*App.ts')
  // const entryPoints = glob
  //   .sync('examples/**/index.ts')
  //   .concat('examples/dynamic.ts')
  // const entryPoints = ['examples/dev.ts']
  // const entryPoints = ['examples/prod.ts']
  // const entryPoints = dev ? ['examples/dev.ts'] : ['examples/prod.ts']
  const result = await esbuild.build({
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
      beforePlugin(async () => {
        await writeIndexFile('examples/react/ReactApp.tsx', 'react', 'my')
        // await writeIndexFile('examples/vue/VueApp.vue', 'vue', 'my')
        await writeIndexFile('examples/svelte/SvelteApp.svelte', 'svelte', 'my')
        await writeMetaFile('examples/vue/VueApp.vue', 'vue', 'my')
      }),
      // This is just for local dev
      aliasPlugin({
        '@frlow/brine/client': './client',
      }),
    ],
    watch: dev,
    write: false,
    metafile: true,
  })
  if (!dev) {
    console.log(await analyzeMetafile(result.metafile))
  }
})()
