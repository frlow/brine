import { GenerateWrapperFunction, WrapperFile } from '../wrapper'
import ts, { JsxEmit, ModuleKind } from 'typescript'
import { camelize, kebabize } from '../../utils/kebabize'
import path from 'path'
import { getTypeImports } from '../importedTypes'

export const reactWrapperGenerator: GenerateWrapperFunction = async (
  analysisResult,
  prefix,
  importMap
) => {
  const props = analysisResult.props.map(
    (prop) =>
      `${prop.name}${prop.optional ? '?' : ''}:${prop.type.getText(
        analysisResult.sourceFile
      )}`
  )
  const propNames = analysisResult.props.map((prop) => prop.name)
  const emits = analysisResult.emits.map(
    (emit) =>
      `${'on' + camelize(emit.name)}?:(val: ${emit.type.getText(
        analysisResult.sourceFile
      )})=>void`
  )
  const emitNames = analysisResult.emits.map(
    (emit) => 'on' + camelize(emit.name)
  )
  const standardAttributes = {
    slot: 'string',
    children: 'React.ReactNode',
  }
  const importedTypes = getTypeImports(analysisResult.sourceFile)
  const inputType = `{${propNames
    .concat(emitNames)
    .concat(Object.keys(standardAttributes))
    .join(', ')}}:{${props
    .concat(emits)
    .concat(
      Object.entries(standardAttributes).map(
        ([key, value]) => `${key}?:${value}`
      )
    )
    .join(', ')}}`
  const autoImports: string[] = importMap
    ? importMap[analysisResult.name].map((ai) =>
        path.join('..', '..', ai).replace('.js', '')
      )
    : []
  const code = `import React,{useEffect, useRef} from 'react'
${autoImports.map((ai) => `import '${ai}'`).join('\n')}
export const ${analysisResult.name} = (${inputType}): JSX.Element => {
  const ref = useRef(null)
  
  ${analysisResult.emits
    .map(
      (emit) =>
        `const on${camelize(
          emit.name
        )}Callback = React.useCallback((ev)=>on${camelize(
          emit.name
        )}&&on${camelize(emit.name)}(ev.detail && ev.detail[0]),[on${camelize(
          emit.name
        )}])`
    )
    .join('\n')}
  
  useEffect(() => {
    const { current } = ref
    ${analysisResult.emits
      .map(
        (emit) =>
          `current.addEventListener('${prefix}-${emit.name}', on${camelize(
            emit.name
          )}Callback)`
      )
      .join('\n')}
    return () => {
      ${analysisResult.emits
        .map(
          (emit) =>
            `current.removeEventListener('${prefix}-${emit.name}', on${camelize(
              emit.name
            )}Callback)`
        )
        .join('\n')}
    }
  },[${analysisResult.emits
    .map((emit) => `on${camelize(emit.name)}`)
    .join(',')}])
  return <${prefix}-${kebabize(
    analysisResult.name
  )} ref={ref} ${analysisResult.props
    .map(
      (pn) =>
        `${pn.name}={${
          pn.type.getText(analysisResult.sourceFile) === 'string'
            ? pn.name
            : `JSON.stringify(${pn.name})`
        }}`
    )
    .concat(
      Object.keys(standardAttributes)
        .filter((d) => d !== 'children')
        .map((sa) => `${sa}={${sa}}`)
    )
    .join(' ')}>{children}</${prefix}-${kebabize(analysisResult.name)}>
}
`
  const transpiled = ts.transpileModule(code, {
    compilerOptions: { jsx: JsxEmit.React, module: ModuleKind.ES2020 },
  })
  const declaration = `import * as React from 'react';
import type {${importedTypes.join(', ')}} from '../types'
export declare const ${analysisResult.name}: (${inputType}) => JSX.Element;
`
  const ret: WrapperFile = {
    code: [
      { content: transpiled.outputText, fileType: 'js' },
      { content: declaration, fileType: 'd.ts' },
    ],
    exportCodeLine: `export * from './${analysisResult.name}'`,
    declarationLine: `export * from './${analysisResult.name}'`,
  }
  return ret
}
