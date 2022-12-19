import esbuild, {
  analyzeMetafile,
  Plugin,
  BuildResult,
  BuildOptions,
} from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue3'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import glob from 'glob'
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
  // ==============================
} from '../src/build'
import aliasPlugin from 'esbuild-plugin-alias'

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
  },
})

let lastBuild: string[] = []
const start = async () => {
  const outbase = 'examples'
  const outdir = 'dist'
  const dev = process.argv[2] === 'watch'
  const prefix = 'my'

  const entryPoints = ['examples/prod.ts']
  const hct = dev ? startHotComponentTransplantServer() : () => {}
  console.log(
    `Use the following code in console to start hot transplanting components\n===================\n`,
    hotReloadSnippet(),
    `\n===================`
  )
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
      (sveltePlugin as any)({
        preprocess: [(sveltePreprocess as any)()],
      }),
      effectPlugin(
        async () => {
          const startTime = Date.now()

          // ============================
          // Generate boilerplate
          await writeIndexFile('examples/apps/react/ReactApp.tsx', prefix)
          await writeMetaFile('examples/apps/svelte/SvelteApp.svelte', prefix)
          await writeMetaFile('examples/apps/vue/VueApp.vue', prefix)
          await writeMetaFile('examples/apps/tester/Tester.svelte', prefix)
          // ============================

          // ============================
          // Generate type docs
          const types = await generateTypes(
            [
              'examples/apps/react/ReactApp.tsx',
              'examples/apps/svelte/SvelteApp.svelte',
              'examples/apps/vue/VueApp.vue',
              'examples/apps/tester/Tester.svelte',
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
          hct(result.outputFiles.map((f) => f.path.replace(process.cwd(), '')))
          // ============================

          console.log('Build time: ', Date.now() - startTime, 'ms')
        }
      ),
      // This is just for local dev
      aliasPlugin({
        brinejs: './src/index.ts',
        'react-wrapper': './dist/wrapper/reactWrappers.tsx',
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
start().then()
