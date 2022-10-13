import { ElementsModule } from '../Module'
import fs from 'fs'
import glob from 'glob'
import { analyzeLitFile } from './litAnalyzer'
import { litElementsPlugin } from './litElementsPlugin'

export const litElementsModule: ElementsModule = {
  name: 'lit',
  plugin: litElementsPlugin,
  analyzeFunc: analyzeLitFile,
  findMatchingFiles: (source) =>
    fs.lstatSync(source).isFile()
      ? source.endsWith('.lit.ts')
        ? [source]
        : []
      : glob.sync(`${source}/**/*.lit.ts`),
}
