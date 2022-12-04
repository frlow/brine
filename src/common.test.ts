import { build, Plugin } from 'esbuild'

export const buildAndImport = async (code: string) => {
  // const dummyPlugin
  const result = await build({
    entryPoints: ['dummy.js'],
    bundle: false,
    write: false,
    sourcemap: false,
  })
}
