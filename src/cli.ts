#!/usr/bin/env node
import commandLineArgs, { OptionDefinition } from 'command-line-args'
import { build } from './modules/build'
import { bundle } from './modules/bundle'
import { analyze } from './modules/analyze'
import { wrapper } from './modules/wrapper'
import { watch } from 'chokidar'
import { docs, startReloadServer, writeDocs } from './modules/docs'
import fs from 'fs'
import path from 'path'
import { importTypes } from './modules/importedTypes'
import { elementsModules, wrapperModules } from './activeModules'
import { writeFile } from './utils/writeFile'

const validateVariable = <T>(value: T, name: string): T => {
  if (!value) {
    console.warn(`${name} not set`)
    process.exit(0)
  }
  return value as T
}

async function runBuild(
  dist: string,
  source: string,
  prefix: string,
  external: string[],
  autoImport: boolean
) {
  const startTime = new Date().getTime()
  if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true })
  const analyzerResult = await analyze(
    source,
    elementsModules,
    prefix,
    dist,
    writeFile
  )
  await importTypes(analyzerResult.analysisResults, dist)
  await wrapper(
    dist,
    analyzerResult.analysisResults,
    wrapperModules.map((wm) => ({
      name: wm.fileType,
      wrapperFunction: wm.generateFunc,
    })),
    prefix,
    false,
    writeFile
  )
  await build({
    dist,
    source,
    modules: elementsModules,
    external,
    prefix,
    analysisResults: analyzerResult.analysisResults,
  })
  await bundle(dist)
  if (autoImport) {
    await wrapper(
      dist,
      analyzerResult.analysisResults,
      wrapperModules.map((wm) => ({
        name: wm.fileType,
        wrapperFunction: wm.generateFunc,
      })),
      prefix,
      true,
      writeFile
    )
  }

  const endTime = new Date().getTime()
  console.log(`Build finished in: ${endTime - startTime} ms`)
}

;(async () => {
  const mainDefinitions: OptionDefinition[] = [
    { name: 'name', defaultOption: true },
  ]
  const mainCommand = commandLineArgs(mainDefinitions, {
    stopAtFirstUnknown: true,
  })
  let argv = mainCommand._unknown || []
  const command = validateVariable<string>(mainCommand.name, 'Command')
  if (command === 'build' || command === 'start') {
    const buildDefinitions = [
      { name: 'source', defaultOption: true },
      { name: 'prefix', alias: 'x', type: String },
      { name: 'outdir', alias: 'o', type: String },
      { name: 'no-docs', type: Boolean },
      { name: 'exclude', type: String, multiple: true },
      { name: 'auto-import', alias: 'a', type: Boolean },
    ]
    const buildOptions = commandLineArgs(buildDefinitions, {
      argv,
      stopAtFirstUnknown: false,
    })
    const source: string = validateVariable(buildOptions.source, 'source dir')
    const dist: string = validateVariable(buildOptions.outdir, '--outdir (-o)')

    const prefix: string = validateVariable(
      buildOptions.prefix,
      '--prefix (-x)'
    )
    const external: string[] = buildOptions.external || []
    const autoImport: boolean = !!buildOptions['auto-import']
    const noDocs: boolean = !!buildOptions['no-docs']
    if (command === 'build') {
      await runBuild(dist, source, prefix, external, autoImport)
      if (!noDocs) await writeDocs(source, prefix, prefix, dist, writeFile)
    } else if (command === 'start') {
      let timeout: NodeJS.Timeout
      let reload = () => {}
      if (!noDocs) {
        docs(prefix, dist, source, prefix)
        reload = startReloadServer()
      }
      const watchDir = path.isAbsolute(source)
        ? source
        : path.join(process.cwd(), source)
      watch(watchDir).on('all', (event, changedPath, stats) => {
        const distDir = path.resolve(dist)
        if (changedPath.startsWith(distDir)) return
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
          console.log('Change detected, rebuilding...')
          await runBuild(dist, source, prefix, external, autoImport)
          reload()
        }, 50)
      })
    }
  }
})()
