import { ElementsModule, WrapperModule } from '../Module'
import { reactElementPlugin } from './reactElementPlugin'
import { analyzeReactFile } from './reactAnalyzer'
import { reactWrapperGenerator } from './reactWrapper'
import { buildReactTestApp } from './reactTestBuilder'
import glob from 'glob'
import fs from 'fs'

export const reactElementsModule: ElementsModule = {
  name: 'react',
  plugin: reactElementPlugin,
  analyzeFunc: analyzeReactFile,
  findMatchingFiles: (dir) =>
    glob.sync(`${dir}/**/*.tsx`).filter((file) => {
      const code = fs.readFileSync(file, 'utf8')
      return code.includes('export default') && code.includes('import React')
    }),
}

export const reactWrapperModule: WrapperModule = {
  name: 'react',
  fileType: 'react',
  generateFunc: reactWrapperGenerator,
  buildTestApp: buildReactTestApp,
}
