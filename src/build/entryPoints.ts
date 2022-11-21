import path from 'path'
import { kebabize } from '../utils/string'
import fs from 'fs'
import index from '../../examples/vanilla/main'
import { Framework } from '../analysis/common'
import { analyze, getAttributes, getEmits } from '../analysis'

// TODO this should be a reference to an npm lib
const wrapperSrc = 'src/wrapper'

const autoImportMessage = '// This is an auto-generated file!'

export const generateIndexFile = (
  component: string,
  from: string,
  to: string,
  prefix: string,
  name?: string
) => {
  const source = component.replace(from, to)
  const relative = path.parse(path.relative(path.parse(component).dir, source))
  const target = path.join(relative.dir, 'main')
  const wrapper = path.relative(path.parse(component).dir, wrapperSrc)
  const tag = prefix + '-' + kebabize(relative.name)
  const code = `${autoImportMessage}
import { createWrapper } from '${wrapper}'
import app from '${target}'
import style from '${target}.css'
customElements.define('${tag}', createWrapper(app, style))`
  const parsedComponent = path.parse(component)
  const indexFilePath = path.join(
    parsedComponent.dir,
    (name || 'index') + '.js'
  )
  fs.writeFileSync(indexFilePath, code, 'utf8')
  return indexFilePath
}

const getEnding = (ext: string) => {
  switch (ext) {
    case '.svelte':
      return '.svelte'
    case '.vue':
      return '.vue'
    default:
      return ''
  }
}

export const generateMainFile = async (
  component: string,
  framework: Framework
) => {
  const parsed = path.parse(component)
  const mainFilePath = path.join(parsed.dir, 'main.ts')
  const result = await analyze(component, framework)
  const wrapper = path.relative(parsed.dir, wrapperSrc)
  const code = `${autoImportMessage}
import {${framework}CustomElementComponent} from '${wrapper}/${framework}'
import App from './${parsed.name}${getEnding(parsed.ext)}'

export default ${framework}CustomElementComponent(
  App,
  ${JSON.stringify(getAttributes(result))},
  ${JSON.stringify(getEmits(result))}
)
`
  fs.writeFileSync(mainFilePath, code, 'utf8')
  return mainFilePath
}
