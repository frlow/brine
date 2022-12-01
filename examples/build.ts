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
  writeIndexFile,
  writeMetaFile,
  generateTypes,
  writeTypesFile,
  writeWrappersFile,
  startHotComponentTransplantServer,
  groupJsMapCssFiles,
  writeJsMapCssGroup,
} from '../src/build'
import aliasPlugin from 'esbuild-plugin-alias'

enum Mode {
  standalone,
  dev,
  prod,
  dynamic,
  auto,
}

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

// =================
// Set mode here
const buildMode: Mode = Mode.auto
// End mode setter
// =================

let lastBuild: string[] = []
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
  const hct = dev ? startHotComponentTransplantServer() : () => {}
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
          // ============================

          // ============================
          // Generate type docs
          await writeTypesFile(types, 'dist')
          await writeWrappersFile(types, 'dist/wrapper')
          // ============================
          return startTime
        },
        async (options, result, startTime) => {
          // ============================
          // Css Injections
          const groupedFiles = groupJsMapCssFiles(result.outputFiles)
          await writeJsMapCssGroup(groupedFiles)
          // ============================

          // ============================
          // Hot Component Transplant
          const jsFiles = result.outputFiles.filter((d) =>
            d.path.endsWith('.js')
          )
          const changedFiles = jsFiles.filter(
            (d) => !lastBuild.includes(d.path)
          )
          hct(changedFiles.map((f) => f.path.replace(process.cwd(), '')))
          lastBuild = jsFiles.map((f) => f.path)
          // ============================

          console.log('Build time: ', Date.now() - startTime, 'ms')
        }
      ),
      // This is just for local dev
      aliasPlugin({
        '@frlow/brine': './src/client/index.ts',
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
