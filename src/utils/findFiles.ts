import glob from 'glob'
import path from 'path'

export const findFiles = (
  dir: string,
  filter: (str: string) => boolean
): string[] => glob.sync(`${dir}/**/*`).filter(filter)

export const getComponentName = (filePath: string) => {
  return path.parse(filePath).name.split('.')[0]
}

export const getFileMap = (outdir: string) =>
  findFiles(path.join(outdir, 'elements'), () => true).reduce((acc, cur) => {
    const isMap = cur.endsWith('.map')
    const isStyle = cur.endsWith('.style.js')
    if (!isStyle && !isMap)
      acc[getComponentName(cur)] = path.relative(outdir, path.resolve(cur))
    return acc
  }, {} as { [i: string]: string })
