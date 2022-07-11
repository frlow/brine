import path from 'path'
import { Plugin } from 'esbuild'

export const fakeFilePlugin = (filter: RegExp, code: string): Plugin => ({
  name: 'fake-file',
  setup(build) {
    build.onResolve({ filter }, async (args) => {
      return { path: path.join(args.resolveDir, args.path) }
    })
    build.onLoad({ filter }, async (args) => {
      return {
        loader: 'tsx',
        contents: code,
        resolveDir: path.dirname(args.path),
      }
    })
  },
})
