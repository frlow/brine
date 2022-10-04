import { create } from 'browser-sync'

export const serveDocs = (dist: string) => {
  const bs = create()
  bs.init({
    server: `${dist}/docs/`,
    single: true,
    open: false,
    ui: false,
  })
  return bs
}
