import type { Plugin } from 'esbuild'
import { analyzeMetafile } from 'esbuild'

export const metaPlugin = (dev: boolean): Plugin => ({
  name: 'meta-plugin',
  setup(build) {
    build.onEnd(async (result) => {
      if (!dev && result.metafile)
        console.log(await analyzeMetafile(result.metafile))
    })
  },
})
