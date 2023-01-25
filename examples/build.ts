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
import glob from 'glob'
import {
  startHotComponentTransplantServer,
  hotReloadSnippet,
  groupJsMapCssFiles,
  writeJsMapCssGroup,
  writeAllTypesFiles,
  brineSveltePreprocessor,
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
    treeShaking: true,
    define: { 'process.env.NODE_ENV': dev ? '"development"' : '"production"' },
    plugins: [
      jsxPlugin,
      vuePlugin({
        compilerOptions: { isCustomElement: (tag) => tag.startsWith('my-') },
      }),
      sveltePlugin({
        preprocess: [brineSveltePreprocessor, sveltePreprocess()],
      }),
      effectPlugin(
        async () => {
          const startTime = Date.now()
          if (fs.existsSync('./dist')) fs.rmSync('./dist', { recursive: true })
          await writeAllTypesFiles({
            files: glob.sync('examples/**/*.@(vue|svelte|tsx)'),
            prefix,
            name: 'example',
            version: '1.0.0',
            outdir: 'dist',
          })
          return startTime
        },
        async (options, result, startTime) => {
          await writeJsMapCssGroup(groupJsMapCssFiles(result.outputFiles))
          hct(result.outputFiles.map((f) => f.path))
          console.log('Build time: ', Date.now() - startTime, 'ms')
        }
      ),
      // This is just for local dev
      aliasPlugin({
        brinejs: './src',
        'react-wrapper': './dist/reactWrappers.tsx',
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
