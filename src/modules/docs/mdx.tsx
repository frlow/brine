import { importMdx } from './es.cjs'
import esbuild from 'esbuild'
import { renderToString } from 'react-dom/server'

export const compileMdx = async (file: string) => {
  const mdx = await importMdx()
  const result = await esbuild.build({
    entryPoints: [file],
    outfile: 'output.js',
    format: 'cjs',
    bundle: true,
    plugins: [mdx({})],
    write: false,
  })
  const code = result.outputFiles![0].text
  const Component = eval(code).default
  return renderToString(<Component />)
}
