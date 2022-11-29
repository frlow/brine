import esbuild, { analyzeMetafile, Plugin } from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue3'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import glob from 'glob'
import {
  hotReloadPlugin,
  injectCssPlugin,
  writeIndexFile,
  beforePlugin,
  writeMetaFile,
} from './build/index'
import aliasPlugin from 'esbuild-plugin-alias'
import path from 'path'

enum Mode {
  standalone,
  dev,
  prod,
  dynamic,
}

const buildMode: Mode = Mode.dynamic
const start = async (mode: Mode) => {
  const outbase = 'examples'
  const outdir = 'dist'
  const dev = process.argv[2] === 'watch'
  const prefix = 'my'

  const entryPoints =
    mode === Mode.standalone
      ? glob.sync('examples/*App.ts')
      : mode === Mode.dev
      ? ['examples/dev.ts']
      : mode === Mode.prod
      ? ['examples/prod.ts']
      : mode === Mode.dynamic
      ? glob.sync('examples/**/index.ts').concat('examples/dynamic.ts')
      : []
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
        await writeIndexFile('examples/react/ReactApp.tsx', 'react', prefix)
        await writeIndexFile(
          'examples/svelte/SvelteApp.svelte',
          'svelte',
          prefix
        )
        await writeMetaFile('examples/vue/VueApp.vue', 'vue', prefix)
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
}
start(buildMode).then()
