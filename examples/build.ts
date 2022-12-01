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
} from '../src/build'
import aliasPlugin from 'esbuild-plugin-alias'
import { injectCss } from '../lib/build/index.js'
import fs from 'fs'

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
const buildMode: Mode = Mode.dev
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
          const jsFiles = result.outputFiles.filter((file) =>
            file.path.endsWith('.js')
          )

          // ============================
          // Css Injections
          const fileTrios = jsFiles.map((file) => {
            const js = file
            const map = result.outputFiles.find(
              (d) => d.path === js.path + '.map'
            )
            const css = result.outputFiles.find(
              (f) =>
                f.path.replace(/-[A-Z,0-9]{8}/, '') ===
                js.path.replace(/-[A-Z,0-9]{8}\.js/, '.css')
            )
            return { js, map, css }
          })
          for (const ft of fileTrios) {
            if (ft.css) {
              const res = await injectCss(ft.js.text, ft.map.text, ft.css.text)
              fs.writeFileSync(ft.js.path, res.replacedJs)
              fs.writeFileSync(ft.map.path, res.replacedMap)
            } else {
              fs.writeFileSync(ft.js.path, ft.js.text)
              fs.writeFileSync(ft.map.path, ft.map.text)
            }
          }
          // ============================

          // ============================
          // Hot Component Transplant
          const changedFiles = jsFiles.filter(
            (d) => !lastBuild.includes(d.path)
          )
          hct(changedFiles.map((f) => f.path.replace(process.cwd(), '')))
          lastBuild = jsFiles.map((f) => f.path)
          console.log('Build time: ', Date.now() - startTime, 'ms')
          // ============================
        }
      ),
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
