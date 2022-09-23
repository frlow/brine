import esbuild from 'esbuild'
import path from 'path'
export const bundle = async (dist: string, isProduction: boolean) => {
  await esbuild.build({
    entryPoints: [path.join(dist, 'elements', 'index.js')],
    bundle: true,
    format: 'iife',
    sourcemap: true,
    outfile: path.join(dist, 'bundle', 'index.js'),
    write: true,
    minify: isProduction,
    watch: false,
  })
  await esbuild.build({
    entryPoints: [path.join(dist, 'elements', 'index.js')],
    bundle: true,
    format: 'esm',
    sourcemap: true,
    outfile: path.join(dist, 'bundle', 'index.mjs'),
    write: true,
    minify: isProduction,
    watch: false,
  })
}
