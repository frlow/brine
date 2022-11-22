import esbuild, { Plugin } from 'esbuild'
import vuePlugin from 'esbuild-plugin-vue3'
import sveltePlugin from 'esbuild-svelte'
import sveltePreprocess from 'svelte-preprocess'
import { generateIndexFile, generateMainFile } from './src/build/entryPoints'
import fs, { rmSync } from 'fs'
import { watch } from 'chokidar'
import path from 'path'
import {
  analyze,
  writeBrineTypes,
  writeVsCodeTypes,
  writeWebTypes,
} from './src/analysis'
import { AnalysisResult } from './src/analysis/common'

const svelteApp = 'examples/svelte/SvelteApp.svelte'
const vueApp = 'examples/vue/VueApp.vue'
const reactApp = 'examples/react/ReactApp.tsx'

const components = [
  path.parse(reactApp).dir,
  path.parse(vueApp).dir,
  path.parse(svelteApp).dir,
  'examples/vanilla',
]

const mainFiles = components.map((c) => `${c}/main.ts`)
const indexFiles = components.map((c) => `${c}/index.js`)

const build = async (remove: boolean = false) => {
  // Auto generate ce file for all except "vanilla"
  const outbase = 'examples'
  const outdir = 'dist'
  const tempDir = `${outdir}/temp`

  const generatedFiles = await Promise.all([
    // React and svelte use default index files
    await generateMainFile(reactApp, 'react'),
    await generateMainFile(svelteApp, 'svelte'),

    // React, Svelte & Vue use default element file
    generateIndexFile(reactApp, outbase, tempDir, 'my'),
    generateIndexFile(svelteApp, outbase, tempDir, 'my'),
    generateIndexFile(vueApp, outbase, tempDir, 'my'),
  ])
  await esbuild.build({
    entryPoints: mainFiles,
    format: 'esm',
    outdir: tempDir,
    outbase,
    bundle: true,
    sourcemap: true,
    splitting: true,
    define: { 'process.env.NODE_ENV': '"production"' },
    plugins: [
      vuePlugin() as Plugin,
      sveltePlugin({
        preprocess: [sveltePreprocess()],
      }),
    ],
  })

  await esbuild.build({
    entryPoints: indexFiles,
    format: 'esm',
    outdir,
    outbase,
    bundle: true,
    sourcemap: true,
    splitting: true,
    minify: true,
    loader: {
      '.css': 'text',
    },
  })

  const vanillaAnalysisResults: AnalysisResult = {
    name: 'Vanilla',
    slots: [],
    emits: [
      {
        type: 'string',
        name: 'my-event',
        optional: true,
      },
    ],
    props: [{ type: 'number', name: 'count', optional: false }],
  }
  const analysisResults = await Promise.all([
    analyze(svelteApp, 'svelte'),
    analyze(vueApp, 'vue'),
    analyze(reactApp, 'react'),
    vanillaAnalysisResults,
  ])
  await writeBrineTypes(analysisResults, outdir)
  await writeWebTypes(analysisResults, outdir)
  await writeVsCodeTypes(analysisResults, outdir)
  debugger

  if (remove) {
    rmSync(tempDir, { recursive: true })
    generatedFiles.forEach((gf) => fs.rmSync(gf))
  }
}

const dev = process.argv[2] === 'watch'
if (dev) {
  let running = false
  watch(['examples', 'src']).on('all', async () => {
    if (running) return
    running = true
    await build()
    running = false
  })
} else build(true).then()
