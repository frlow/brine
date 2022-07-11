import esbuild, { Plugin } from 'esbuild'
import path from 'path'
import fs from 'fs'
import { findFiles } from '../utils/findFiles'
import { ElementsModule } from './Module'
import sassPlugin from 'esbuild-sass-plugin'
import { AnalysisResult } from './analyze'
import { tsxPlugin } from './common/TsxPlugin'
import { nativeEventsPlugin } from './common/NativeEventsPlugin'

const transformCssFiles = (dist: string) => {
  const jsFiles = findFiles(
    dist,
    (str) => str.endsWith('.js') && !str.endsWith('index.js')
  )
  jsFiles.forEach((jsFile) => {
    const parsed = path.parse(jsFile)
    const cssPath = path.join(parsed.dir, parsed.name + '.css')
    const cssMapPath = path.join(parsed.dir, parsed.name + '.css.map')
    const stylePath = path.join(parsed.dir, parsed.name + '.style.js')
    const hasCss = fs.existsSync(cssPath)
    const css = hasCss
      ? fs.readFileSync(cssPath, 'utf8').replace('sourceMappingURL', '')
      : ''
    const styleFile = `export default \`${css}\``
    fs.writeFileSync(stylePath, styleFile, 'utf8')
    if (hasCss) {
      fs.rmSync(cssPath)
      fs.rmSync(cssMapPath)
    }
  })
}

const styleExternalPlugin: esbuild.Plugin = {
  name: 'style-external',
  setup(build) {
    build.onResolve({ filter: /\.style/ }, async (args) => {
      return { external: true }
    })
  },
}

export const getPlugins = (
  modules: ElementsModule[],
  prefix: string,
  dist: string,
  analysisResults: AnalysisResult[]
) => [
  styleExternalPlugin,
  sassPlugin(),
  tsxPlugin,
  nativeEventsPlugin,
  ...modules.map((em) =>
    em.plugin({
      prefix,
      dist,
      analysisResults,
    })
  ),
]

export const build = async ({
  dist,
  source,
  modules,
  external,
  prefix,
  analysisResults,
}: {
  dist: string
  source: string
  modules: ElementsModule[]
  external: string[]
  prefix: string
  analysisResults: AnalysisResult[]
}) => {
  const outDir = path.join(dist, 'elements')
  const files = modules.flatMap((module) =>
    module.findMatchingFiles(source).map((file) => ({ file, module }))
  )
  const plugins = getPlugins(modules, prefix, dist, analysisResults)
  const entryFiles = files.map(
    (file) => `${file.file}?type=entry-point&module=${file.module.name}`
  )
  const result = await esbuild.build({
    entryPoints: [...entryFiles],
    bundle: true,
    splitting: true,
    format: 'esm',
    sourcemap: true,
    define: { 'process.env.NODE_ENV': '"production"' },
    outdir: outDir,
    plugins,
    chunkNames: 'chunks/[name]-[hash]',
    write: true,
    minify: false,
    metafile: true,
    external: [...external, '*.style'],
  })
  fs.writeFileSync(
    path.join(outDir, 'meta.json'),
    JSON.stringify(result.metafile)
  )
  transformCssFiles(path.join(dist, 'elements'))
  const processDir = (dir: string) => {
    const files = fs
      .readdirSync(dir)
      .map((f) => path.join(dir, f))
      .filter((f) => !f.endsWith('/chunks'))
      .filter((f) => f.endsWith('.js') || fs.lstatSync(f).isDirectory())
    fs.writeFileSync(
      path.join(dir, 'index.js'),
      files.map((file) => `import './${path.relative(dir, file)}'`).join('\n'),
      'utf8'
    )
    files.forEach((file) => {
      if (fs.lstatSync(file).isDirectory()) processDir(file)
    })
  }
  processDir(path.join(process.cwd(), outDir))
}
