import esbuild from 'esbuild'
import { getFullPath, getUrlParams } from '../../utils/pluginUtils'

export const tsxPlugin: esbuild.Plugin = {
  name: 'ucp-tsx-plugin',
  setup(build) {
    build.onResolve({ filter: /\.tsx/ }, async (args) => {
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
  },
}
