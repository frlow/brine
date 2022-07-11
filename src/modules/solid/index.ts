import { ElementsModule } from '../Module'
import glob from 'glob'
import { analyzeReactFile } from '../react/reactAnalyzer'
import { solidElementPlugin } from './solidElementPlugin'
import fs from 'fs'

export const solidElementsModule: ElementsModule = {
  name: 'solid',
  plugin: solidElementPlugin,
  analyzeFunc: analyzeReactFile,
  findMatchingFiles: (dir) =>
    glob
      .sync(`${dir}/**/*.solid.tsx`)
      .filter((file) =>
        fs.readFileSync(file, 'utf8').includes('export default')
      ),
}
