#!/usr/bin/env node
import commandLineArgs, { OptionDefinition } from 'command-line-args'
import { build } from './modules/build'
import { watch } from 'chokidar'
import path from 'path'
import { runStages } from './stages'
import { serveDocs } from './modules/docs'
import { init } from './modules/init'

const validateVariable = <T>(value: T, name: string): T => {
  if (!value) {
    console.warn(`${name} not set`)
    process.exit(0)
  }
  return value as T
}

;(async () => {
  const mainDefinitions: OptionDefinition[] = [
    { name: 'command', defaultOption: true },
  ]
  const mainCommand = commandLineArgs(mainDefinitions, {
    stopAtFirstUnknown: true,
  })
  let argv = mainCommand._unknown || []
  const command = mainCommand.command
  if (command === 'build' || command === 'start') {
    const buildDefinitions = [
      { name: 'source', defaultOption: true },
      { name: 'prefix', alias: 'x', type: String },
      { name: 'outdir', alias: 'o', type: String },
      { name: 'no-docs', type: Boolean },
    ]
    const buildOptions = commandLineArgs(buildDefinitions, {
      argv,
      stopAtFirstUnknown: false,
    })
    const source: string = buildOptions.source || '.'
    const dist: string = buildOptions.outdir || 'dist'

    const prefix: string = validateVariable(
      buildOptions.prefix,
      '--prefix (-x)'
    )
    const external: string[] = buildOptions.external || []
    const noDocs: boolean = !!buildOptions['no-docs']
    if (command === 'build') {
      await runStages(dist, source, prefix, external, !noDocs)
    } else if (command === 'start') {
      let timeout: NodeJS.Timeout
      const watchDir = path.isAbsolute(source)
        ? source
        : path.join(process.cwd(), source)
      await runStages(dist, source, prefix, external, !noDocs)
      const bs = noDocs ? { reload: () => {} } : serveDocs(dist)
      watch(watchDir).on('all', (event, changedPath) => {
        const distDir = path.resolve(dist)
        if (changedPath.startsWith(distDir)) return
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
          console.log('Change detected, rebuilding...')
          try {
            await runStages(dist, source, prefix, external, !noDocs)
            bs.reload()
          } catch (e) {
            console.log(e)
          }
        }, 50)
      })
    }
  } else if (command === 'init') {
    const buildDefinitions = [
      { name: 'outdir', defaultOption: true },
      { name: 'source', alias: 's', type: String },
    ]
    const buildOptions = commandLineArgs(buildDefinitions, {
      argv,
      stopAtFirstUnknown: false,
    })
    const source = buildOptions.source || path.join(__dirname, 'example')
    const outDir: string = buildOptions.outdir || '.'
    await init(source, outDir)
  } else
    console.log(`Brine
Syntax:
 - brine init <target>
 - brine start -x <prefix>
 - brine build -x <prefix>`)
})()
