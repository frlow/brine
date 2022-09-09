import glob from 'glob'
import path from 'path'

export const findFiles = (
  dir: string,
  filter: (str: string) => boolean
): string[] => glob.sync(`${dir}/**/*`).filter(filter)

export const getComponentName = (filePath: string) => {
  return path.parse(filePath).name.split('.')[0]
}
