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
  buildTimePlugin,
  writeTypesFile,
  generateTypes,
  writeWrappersFile,
} from '../src/build'
import aliasPlugin from 'esbuild-plugin-alias'
import path from 'path'

enum Mode {
  standalone,
  dev,
  prod,
  dynamic,
  auto,
}

// =================
// Set mode here
const buildMode: Mode = Mode.dev
// End mode setter
// =================

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
      ? glob.sync('examples/apps/**/index.ts').concat('examples/dynamic.ts')
      : mode === Mode.auto
      ? ['examples/auto.ts']
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
    define: { 'process.env.NODE_ENV': dev ? '"development"' : '"production"' },
    plugins: [
      vuePlugin() as Plugin,
      sveltePlugin({
        preprocess: [sveltePreprocess()],
      }),
      injectCssPlugin(),
      buildTimePlugin(),
      hotReloadPlugin(),
      beforePlugin(async () => {
        await writeIndexFile(
          'examples/apps/react/ReactApp.tsx',
          'react',
          prefix
        )
        await writeIndexFile(
          'examples/apps/svelte/SvelteApp.svelte',
          'svelte',
          prefix
        )
        await writeMetaFile('examples/apps/vue/VueApp.vue', 'vue', prefix)
        const types = await generateTypes(
          [
            {
              path: 'examples/apps/react/ReactApp.tsx',
              framework: 'react',
            },
            {
              path: 'examples/apps/svelte/SvelteApp.svelte',
              framework: 'svelte',
            },
            { path: 'examples/apps/vue/VueApp.vue', framework: 'vue' },
          ],
          'my'
        )
        await writeTypesFile(types, 'dist')
        await writeWrappersFile(types, 'dist/wrapper')
      }),
      // This is just for local dev
      aliasPlugin({
        '@frlow/brine/lib/client': './src/client',
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
