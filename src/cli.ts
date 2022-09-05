#!/usr/bin/env node
import commandLineArgs, { OptionDefinition } from 'command-line-args'
import { build } from './modules/build'
import { watch } from 'chokidar'
import path from 'path'
import { runStages } from './stages'
import { serveDocs } from './modules/docs'

const validateVariable = <T>(value: T, name: string): T => {
  if (!value) {
    console.warn(`${name} not set`)
    process.exit(0)
  }
  return value as T
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
      await runStages(dist, source, prefix, external, autoImport, !noDocs)
    } else if (command === 'start') {
      let timeout: NodeJS.Timeout
      const watchDir = path.isAbsolute(source)
        ? source
        : path.join(process.cwd(), source)
      await runStages(dist, source, prefix, external, autoImport, !noDocs)
      const bs = serveDocs(dist)
      watch(watchDir).on('all', (event, changedPath) => {
        const distDir = path.resolve(dist)
        if (changedPath.startsWith(distDir)) return
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
          console.log('Change detected, rebuilding...')
          await runStages(dist, source, prefix, external, autoImport, !noDocs)
          bs.reload()
        }, 50)
      })
    }
  }
})()
