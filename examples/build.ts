import esbuild, {
  analyzeMetafile,
  Plugin,
  BuildResult,
  BuildOptions,
} from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue3'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import fs from 'fs'
import {
  // ==== hot reload ====
  startHotComponentTransplantServer,
  hotReloadSnippet,
  // =============

  // ==== boilerplate generation ====
  writeMetaFile,
  writeIndexFile,
  // ================================

  // ==== css injection ====
  groupJsMapCssFiles,
  writeJsMapCssGroup,
  // =======================

  // ==== type docs generation ====
  generateTypes,
  writeTypesFile,
  writeVsCodeTypes,
  writeWebTypes,
  writeReactWrappersFile,
  writeMetaLiteFile,
  writeJSXIntrinsicElementsInterface,
  // ==============================
} from 'brinejs'
import aliasPlugin from 'esbuild-plugin-alias'
import express from 'express'
import { jsxPlugin } from './jsxPlugin'

const effectPlugin = <T>(
  before: (options: BuildOptions) => Promise<T>,
  after: (options: BuildOptions, result: BuildResult, data: T) => Promise<void>
): Plugin => ({
  name: 'effect-plugin',
  setup(build) {
    let data: T = undefined
    build.onStart(async () => {
      data = await before(build.initialOptions)
    })
    build.onEnd(async (result) => {
      await after(build.initialOptions, result, data)
    })
    build.onResolve({ filter: /.*/ }, async () => {
      return {}
    })
  },
})

const start = async () => {
  const outbase = 'examples'
  const outdir = 'dist'
  const dev = process.argv[2] === 'watch'
  const prefix = 'my'

  const hct = dev
    ? startHotComponentTransplantServer({
        rootUrl: 'http://localhost:3000/dist',
      })
    : () => {}
  console.log(
    `Use the following code in console to start hot transplanting components\n===================\n`,
    hotReloadSnippet(),
    `\n===================`
  )
  const result = await esbuild.build({
    entryPoints: ['./examples/prod.ts'],
    format: 'esm',
    outdir: outdir,
    outbase,
    bundle: true,
    sourcemap: true,
    splitting: true,
    minify: !dev,
    // treeShaking: true,
    define: { 'process.env.NODE_ENV': dev ? '"development"' : '"production"' },
    plugins: [
      jsxPlugin,
      vuePlugin({
        compilerOptions: { isCustomElement: (tag) => tag.startsWith('my-') },
      }),
      sveltePlugin({
        preprocess: [sveltePreprocess()],
      }),
      effectPlugin(
        async () => {
          const startTime = Date.now()
          if (fs.existsSync('./dist')) fs.rmSync('./dist', { recursive: true })

          // ============================
          // Generate boilerplate
          await writeIndexFile(
            'examples/apps/react/ReactApp/ReactApp.tsx',
            prefix
          )
          await writeIndexFile(
            'examples/apps/svelte/SvelteApp/SvelteApp.svelte',
            prefix
          )
          await writeIndexFile('examples/apps/vue/VueApp/VueApp.vue', prefix)
          await writeIndexFile(
            'examples/apps/solid/SolidApp/SolidApp.tsx',
            prefix,
            'solid'
          )
          await writeMetaLiteFile('examples/apps/vue/VueApp/VueApp.vue', prefix)
          await writeIndexFile(
            'examples/apps/svelte/Tester/Tester.svelte',
            prefix
          )
          // ============================

          // ============================
          // Generate type docs
          const types = await generateTypes(
            [
              'examples/apps/react/ReactApp/ReactApp.tsx',
              'examples/apps/solid/SolidApp/SolidApp.tsx',
              'examples/apps/svelte/SvelteApp/SvelteApp.svelte',
              'examples/apps/svelte/Tester/Tester.svelte',
              'examples/apps/vue/VueApp/VueApp.vue',
            ],
            prefix
          )
          await writeTypesFile(types, 'dist')
          await writeVsCodeTypes(types, 'dist')
          await writeWebTypes(types, 'dist', {
            name: 'example',
            version: '1.0.0',
          })
          await writeReactWrappersFile(types, 'dist/wrapper')
          await writeJSXIntrinsicElementsInterface(types, 'dist')
          // ============================
          return startTime
        },
        async (options, result, startTime) => {
          // ============================
          // Css Injections
          await writeJsMapCssGroup(groupJsMapCssFiles(result.outputFiles))
          // ============================

          // ============================
          // Hot Component Transplant
          hct(result.outputFiles.map((f) => f.path))
          // ============================

          console.log('Build time: ', Date.now() - startTime, 'ms')
        }
      ),
      // This is just for local dev
      aliasPlugin({
        brinejs: './src',
        'react-wrapper': './dist/wrapper/reactWrappers.tsx',
      }),
    ],
    watch: dev,
    write: false,
    metafile: true,
  })
  if (!dev) {
    console.log(await analyzeMetafile(result.metafile))
  } else {
    const app = express()
    app.use(express.static('.'))
    app.listen(3000)
    console.log('listening on http://localhost:3000')
  }
}
start().then()
