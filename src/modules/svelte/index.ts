import { ElementsModule } from '../Module'
import { analyzeSvelteFile } from './svelteAnalyzer'
import { svelteElementPlugin } from './svelteElementPlugin'
import glob from 'glob'
import fs from 'fs'

export const svelteElementsModule: ElementsModule = {
  name: 'svelte',
  analyzeFunc: analyzeSvelteFile,
  plugin: svelteElementPlugin,
  findMatchingFiles: (dir) =>
    glob
      .sync(`${dir}/**/*.svelte`)
      .filter(
        (file) => !fs.readFileSync(file, 'utf8').includes('<!--exclude-->')
      ),
}
