import type { Plugin } from 'esbuild'

export const beforePlugin = (onBefore: () => Promise<void>): Plugin => ({
  name: 'before-plugin',
  setup(build) {
    build.onStart(async () => await onBefore())
  },
})
