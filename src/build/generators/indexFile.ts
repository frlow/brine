import { Framework, parseFramework } from './common.js'
import path from 'path'
import fs from 'fs'
import { generateMetaCode } from './metaFile.js'

export const generateIndexFile = async (
  file: string,
  framework: Framework,
  prefixOrTag: string
) => {
  const appPath = path.parse(file).base.replace(/\.[j|t]sx?/, '.js')
  const meta = await generateMetaCode(file, framework, prefixOrTag)
  const code = `import { createOptions } from 'brinejs/${framework}'
import { createWrapper, defineComponent, WcWrapperOptionsMeta } from 'brinejs'
import App from './${appPath}'

const meta: WcWrapperOptionsMeta = ${meta}
const options = createOptions(App, meta)
const wrapper = createWrapper(options)
defineComponent(wrapper)
`
  return code
}

export const writeIndexFile = async (
  file: string,
  prefixOrTag: string,
  framework?: Framework,
  fileName?: string
) => {
  const parsedFramework = framework || parseFramework(file)
  const code = await generateIndexFile(file, parsedFramework, prefixOrTag)
  const dir = path.parse(file).dir
  const target = path.join(dir, fileName || 'index.ts')
  fs.writeFileSync(target, code, 'utf8')
}
