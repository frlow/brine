import { importMdx } from './es.cjs'
import esbuild from 'esbuild'

export const compileMdx = async (
  file: string
): Promise<(args: any) => JSX.Element> => {
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
  return eval(code).default
}
