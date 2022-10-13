import esbuild from 'esbuild'
import { AsyncCache, getFullPath, getUrlParams } from '../../utils/pluginUtils'
import path from 'path'
import { PluginOptions } from '../Module'

export const litElementsPlugin = ({
  prefix,
  styles,
}: PluginOptions): esbuild.Plugin => ({
  name: 'brine-lit-plugin',
  setup(build) {
    const cache = new AsyncCache()

    build.onResolve({ filter: /\.lit\.ts/ }, async (args) => {
      const params = getUrlParams(args.path)
      const fullPath = getFullPath(args)
      return {
        path: fullPath,
        namespace:
          params.type === 'entry-point'
            ? `${params.module}-entrypoint`
            : 'file',
        pluginData: {
          ...args.pluginData,
          index: params.index,
        },
      }
    })

    build.onLoad(
      {
        filter: /.*/,
        namespace: 'lit-entrypoint',
      },
      (args) =>
        cache.get([args.path, args.namespace], async () => {
          return {
            loader: 'ts',
            contents: 'console.log("Dummy")',
            resolveDir: path.dirname(args.path),
          }
        })
    )
  },
})
