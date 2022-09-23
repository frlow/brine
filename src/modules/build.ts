import esbuild, { Plugin } from 'esbuild'
import path from 'path'
import fs from 'fs'
import { findFiles } from '../utils/findFiles'
import { ElementsModule } from './Module'
import sassPlugin from 'esbuild-sass-plugin'
import { AnalysisResult } from './analyze'
import { tsxPlugin } from './common/TsxPlugin'
import { nativeEventsPlugin } from './common/NativeEventsPlugin'
import { Dictionary } from '../utils/types'

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

// const styleExternalPlugin: esbuild.Plugin = {
//   name: 'style-external',
//   setup(build) {
//     build.onResolve({ filter: /\.style/ }, async (args) => {
//       return { external: true }
//     })
//   },
// }

export const getPlugins = (
  modules: ElementsModule[],
  prefix: string,
  dist: string,
  analysisResults: AnalysisResult[],
  styles: Dictionary<string>
) => [
  // styleExternalPlugin,
  sassPlugin(),
  tsxPlugin,
  nativeEventsPlugin,
  ...modules.map((em) =>
    em.plugin({
      prefix,
      dist,
      analysisResults,
      styles,
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
  const entryFiles = files.map(
    (file) => `${file.file}?type=entry-point&module=${file.module.name}`
  )
  const runBuild = async ({
    sourcemap,
    metafile,
    plugins,
  }: {
    sourcemap: boolean
    metafile: boolean
    plugins: Plugin[]
  }) =>
    await esbuild.build({
      entryPoints: [...entryFiles],
      bundle: true,
      splitting: true,
      format: 'esm',
      sourcemap,
      define: { 'process.env.NODE_ENV': '"production"' },
      outdir: outDir,
      plugins,
      chunkNames: 'chunks/[name]-[hash]',
      write: false,
      minify: false,
      metafile,
      external: [...external],
    })
  const preResult = await runBuild({
    sourcemap: false,
    metafile: false,
    plugins: getPlugins(modules, prefix, dist, analysisResults, {}),
  })
  const styles = (preResult.outputFiles || []).reduce((acc, cur) => {
    if (cur.path.endsWith('.css')) {
      const fixed = cur.text.replace(/\/\*.*?\*\//g, '')
      acc[path.parse(cur.path).name] = fixed.trim()
    }
    return acc
  }, {} as Dictionary<string>)
  const result = await runBuild({
    sourcemap: true,
    metafile: true,
    plugins: getPlugins(modules, prefix, dist, analysisResults, styles),
  })
  await Promise.all(
    result.outputFiles
      .filter((f) => f.path.endsWith('.js') || f.path.endsWith('.js.map'))
      .map((of) =>
        fs.promises
          .mkdir(path.parse(of.path).dir, { recursive: true })
          .then(() =>
            fs.promises.writeFile(of.path, of.contents, { encoding: 'utf8' })
          )
      )
  )
  fs.writeFileSync(
    path.join(outDir, 'meta.json'),
    JSON.stringify(result.metafile)
  )
  // transformCssFiles(path.join(dist, 'elements'))
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
