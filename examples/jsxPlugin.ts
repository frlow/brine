import { parse } from 'path'
import { Plugin } from 'esbuild'
import { readFile } from 'fs/promises'
// @ts-ignore
import { transformAsync } from '@babel/core'
// @ts-ignore
import solid from 'babel-preset-solid'
// @ts-ignore
import ts from '@babel/preset-typescript'
import { appendJsxProps } from '../src'

export const jsxPlugin: Plugin = {
  name: 'esbuild:jsx',

  setup(build) {
    build.onLoad({ filter: /\.(t|j)sx$/ }, async (args) => {
      const source = await appendJsxProps(
        args.path,
        await readFile(args.path, { encoding: 'utf-8' })
      )
      if (/import.*from.*solid-js/.test(source)) {
        const { name, ext } = parse(args.path)
        const filename = name + ext

        const { code } = await transformAsync(source, {
          presets: [[solid, { delegateEvents: false }], ts],
          filename,
          sourceMaps: 'inline',
        })

        return { contents: code, loader: 'js' }
      }
      return {
        contents: source,
        loader: 'tsx',
      }
    })
  },
}
