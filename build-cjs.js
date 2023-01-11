import esbuild from 'esbuild'
import fs from 'fs'

const external = fs.readdirSync('node_modules')

esbuild
  .build({
    bundle: true,
    entryPoints: ['src/index.ts'],
    platform: 'node',
    outfile: 'lib/index.cjs',
    external,
  })
  .then()
