import { GenerateWrapperFunction, WrapperFile } from '../wrapper'
import ts, { JsxEmit, ModuleKind } from 'typescript'
import { camelize, kebabize } from '../../utils/kebabize'
import { shouldSendAsString } from '../common/utils'

export const reactWrapperGenerator: GenerateWrapperFunction = async (
  analysisResult,
  prefix,
  importMode,
  importFile
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
  const inputType = `{${propNames
    .concat(emitNames)
    .concat(Object.keys(standardAttributes))
    .concat('className')
    .join(', ')}}:{${props
    .concat(emits)
    .concat('className:string')
    .concat(
      Object.entries(standardAttributes).map(
        ([key, value]) => `${key}?:${value}`
      )
    )
    .join(', ')}}`
  const code = `import React,{useEffect, useRef} from 'react'
${importMode === 'auto' ? `import '${importFile}'` : ''}
export const ${analysisResult.name} = (${inputType}): JSX.Element => {
  const ref = useRef<HTMLElement>(null)
  
  ${analysisResult.emits
    .map(
      (emit) =>
        `const on${camelize(
          emit.name
        )}Callback = React.useCallback((ev: any)=>on${camelize(
          emit.name
        )}&&on${camelize(emit.name)}(ev.detail && ev.detail[0]),[on${camelize(
          emit.name
        )}])`
    )
    .join('\n')}
  
  useEffect(() => {
    ${
      importMode === 'lazy'
        ? `// @ts-ignore
    import('${importFile}')`
        : ''
    }
    const { current } = ref
    if (!current) return
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
  // @ts-ignore
  return <${prefix}-${kebabize(
    analysisResult.name
  )} ref={ref} ${analysisResult.props
    .map(
      (pn) =>
        `${pn.name}={${
          shouldSendAsString(pn.type, analysisResult)
            ? pn.name
            : `JSON.stringify(${pn.name})`
        }}`
    )
    .concat(
      Object.keys(standardAttributes)
        .filter((d) => d !== 'children')
        .map((sa) => `${sa}={${sa}}`)
    )
    .concat('class={className}')
    .join(' ')}>{children}</${prefix}-${kebabize(analysisResult.name)}>
}
`
  const transpiled = ts.transpileModule(code, {
    compilerOptions: { jsx: JsxEmit.React, module: ModuleKind.ES2020 },
  })
  const declaration = `import * as React from 'react';
export declare const ${analysisResult.name}: (${inputType}) => JSX.Element;
`
  const ret: WrapperFile = {
    code: [
      { content: transpiled.outputText, fileType: 'js' },
      { content: declaration, fileType: 'd.ts' },
      { content: code, fileType: 'tsx' },
    ],
    exportCodeLine: `export * from './${analysisResult.name}'`,
    declarationLine: `export * from './${analysisResult.name}'`,
  }
  return ret
}
