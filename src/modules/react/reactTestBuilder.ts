import { BuildTestAppFunc, getImportsFromComponent } from '../Module'
import esbuild from 'esbuild'
import path from 'path'
import { fakeFilePlugin } from '../../utils/fakeFilePlugin'
import { generateJsx, loadedSnippet } from '../../utils/testBuilderUtils'

export const buildReactTestApp: BuildTestAppFunc = async (component) => {
  const imports = Object.keys(getImportsFromComponent(component))
  const jsx = generateJsx(component, 'log')
  const code = `import React from 'react'
import { createRoot } from 'react-dom/client'
import {${imports.join(', ')}} from './dist/wrapper/react'
const App = () => {
    const log = (ev)=>window.log.push(ev)
    return ${jsx}
}
const container = document.getElementById('app')
const root = createRoot(container!)
root.render(<App />)
${loadedSnippet}
`
  const plugins: esbuild.Plugin[] = [fakeFilePlugin(/rootapp\.tsx/, code)]
  const result = await esbuild.build({
    entryPoints: [path.join('test', 'rootapp.tsx')],
    bundle: true,
    format: 'iife',
    sourcemap: false,
    outdir: 'dist',
    write: false,
    plugins: plugins,
  })
  return result.outputFiles[0].text
}
