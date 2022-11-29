import type { Plugin } from 'esbuild'

export const buildTimePlugin = (): Plugin => ({
  name: 'build-time',
  setup(build) {
    let start: Date
    build.onStart(() => {
      start = new Date()
    })
    build.onEnd(() => {
      const diff = new Date().getTime() - start.getTime()
      console.log(`Build time: ${diff}ms`)
    })
  },
})
