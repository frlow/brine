import fse from 'fs-extra'

export const init = async (source: string, outDir: string) => {
  await fse.copySync(source, outDir)
}
