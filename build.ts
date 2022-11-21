import esbuild from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue3'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import path from 'path'
import fs from 'fs'
import { kebabize } from './src/utils/string'

const buildAgainPlugin = (entryPoints) => ({
  name: 'build-again-plugin',
  setup(build) {
    if (build.initialOptions.format !== 'esm') throw 'Format must be esm'
    if (!build.initialOptions.splitting) throw 'Splitting must be enabled'
    build.onEnd(async (args) => {
      await esbuild.build({
        entryPoints: entryPoints,
        format: 'esm',
        outdir: 'dist',
        bundle: true,
        sourcemap: true,
        splitting: true,
        minify: true,
        loader: {
          '.css': 'text',
        },
      })
    })
  },
})

const getEntryPoints = (components) => {
  const parsed = components.map((c) => path.parse(c))
  return {
    wrapperEntryPoints: parsed.map((p) => path.join(p.dir, p.name + '.ts')),
    ceEntryPoints: parsed.map((p) => path.join(p.dir, p.name + '.ce.js')),
  }
}
const generateCeFiles = (components, from, to, wrapperSrc, prefix) => {
  for (const component of components) {
    const source = component.replace(from, to)
    const relative = path.parse(
      path.relative(path.parse(component).dir, source)
    )
    const target = path.join(relative.dir, relative.name)
    const wrapper = path.relative(path.parse(component).dir, wrapperSrc)
    const tag = prefix + '-' + kebabize(relative.name)
    const code = `// This is an auto-generated file!
import { createWrapper } from '${wrapper}'
import app from '${target}'
import style from '${target}.css'
customElements.define('${tag}', createWrapper(app, style))`
    const parsedComponent = path.parse(component)
    const ceFilePath = path.join(
      parsedComponent.dir,
      parsedComponent.name + '.ce.js'
    )
    fs.writeFileSync(ceFilePath, code, 'utf8')
  }
}

const svelteApp = 'examples/svelte/SvelteApp.svelte'
const vueApp = 'examples/vue/VueApp.vue'
const reactApp = 'examples/react/ReactApp.tsx'
const vanillaApp = 'examples/vanilla/Vanilla.ts'
const { wrapperEntryPoints, ceEntryPoints } = getEntryPoints([
  svelteApp,
  vueApp,
  reactApp,
  vanillaApp,
])

// Auto generate ce file for all except "vanilla"
generateCeFiles(
  [svelteApp, vueApp, reactApp],
  'examples',
  'dist',
  'src/wrapper',
  'my'
)
const run = async (watch) => {
  await esbuild.build({
    entryPoints: wrapperEntryPoints,
    format: 'esm',
    outdir: 'dist',
    bundle: true,
    sourcemap: true,
    splitting: true,
    define: { 'process.env.NODE_ENV': '"production"' },
    watch,
    plugins: [
      vuePlugin(),
      sveltePlugin({
        preprocess: [sveltePreprocess()],
      }),
      buildAgainPlugin(ceEntryPoints),
    ],
  })
}

const watch = process.argv[2] === 'watch'
run(watch).then()
