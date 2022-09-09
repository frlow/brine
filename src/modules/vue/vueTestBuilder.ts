import { BuildTestAppFunc, getImportsFromComponent } from '../Module'
import esbuild from 'esbuild'
import path from 'path'
import { fakeFilePlugin } from '../../utils/fakeFilePlugin'
import { generateJsx, loadedSnippet } from '../../utils/testBuilderUtils'
import { vuePlugin } from './plugin'

export const buildVueTestApp: BuildTestAppFunc = async (component) => {
  const imports = Object.keys(getImportsFromComponent(component))
  const jsx = generateJsx(component, 'this.log')
  const code = `import { createApp, h } from 'vue'
  import {${imports.join(', ')}} from './dist/wrapper/vue'
  createApp({
    components: {${imports.join(', ')}},
    methods: {
      log(ev){window.log.push(ev)}
    },
    render(){
      return ${jsx}
    }
  }).mount('#app')
${loadedSnippet}
`
  const plugins: esbuild.Plugin[] = [
    fakeFilePlugin(/rootapp\.tsx/, code),
    vuePlugin(
      {},
      {
        prefix: 'ex',
        analysisResults: [],
        dist: 'dist',
      }
    ),
  ]
  const result = await esbuild.build({
    entryPoints: [path.join('test', 'rootapp.tsx')],
    bundle: true,
    format: 'iife',
    sourcemap: false,
    outdir: 'dist',
    write: false,
    plugins: plugins,
    jsxFactory: 'h',
  })
  return result.outputFiles[0].text
}
