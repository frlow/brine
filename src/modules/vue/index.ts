import vuePlugin from './plugin'
import { ElementsModule, WrapperModule } from '../Module'
import { analyzeVueFile } from './vueAnalyzer'
import { vueWrapperGenerator } from './vueWrapper'
import glob from 'glob'
import { buildVueTestApp } from './vueTestBuilder'
import fs from 'fs'

export const vueElementsModule: ElementsModule = {
  name: 'vue',
  analyzeFunc: analyzeVueFile,
  plugin: (opts) => vuePlugin({}, opts),
  findMatchingFiles: (dir) =>
    glob
      .sync(`${dir}/**/*.vue`)
      .filter(
        (file) => !fs.readFileSync(file, 'utf8').includes('<!--exclude-->')
      ),
}

export const vueWrapperModule: WrapperModule = {
  name: 'vue',
  fileType: 'vue',
  generateFunc: vueWrapperGenerator,
  buildTestApp: buildVueTestApp,
}
