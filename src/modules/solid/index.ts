import { ElementsModule } from '../Module'
import glob from 'glob'
import { analyzeReactFile } from '../react/reactAnalyzer'
import { solidElementPlugin } from './solidElementPlugin'
import fs from 'fs'

export const solidElementsModule: ElementsModule = {
  name: 'solid',
  plugin: solidElementPlugin,
  analyzeFunc: analyzeReactFile,
  findMatchingFiles: (source) =>
    fs.lstatSync(source).isFile()
      ? source.endsWith('.solid.tsx')
        ? [source]
        : []
      : glob
          .sync(`${source}/**/*.solid.tsx`)
          .filter((file) =>
            fs.readFileSync(file, 'utf8').includes('export default')
          ),
}
