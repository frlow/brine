import { SyntaxKind } from 'typescript'
import { kebabize } from '../../utils/kebabize'
import { GenerateWrapperFunction } from '../wrapper'
import path from 'path'
import { getTypeImports } from '../importedTypes'

export const vueWrapperGenerator: GenerateWrapperFunction = async (
  analysisResult,
  prefix,
  importMap
) => {
  const autoImports: string[] = importMap
    ? importMap[analysisResult.name].map((ai) =>
        path.join('..', '..', ai).replace('.js', '')
      )
    : []
  const importedTypes = getTypeImports(analysisResult.sourceFile)
  const code = `<script setup lang='ts'>
import type {${importedTypes.join(', ')}} from '../types'
${autoImports.map((ai) => `import '${ai}'`).join('\n')}
${
  analysisResult.props.length > 0
    ? `defineProps<{${analysisResult.props
        .map(
          (prop) =>
            `${prop.name}${prop.optional ? '?' : ''}: ${prop.type.getText(
              analysisResult.sourceFile
            )}`
        )
        .join(', ')}}>()`
    : ''
}
${
  analysisResult.emits.length > 0
    ? `const emit = defineEmits<{ ${analysisResult.emits
        .map((e) =>
          e.type.kind === SyntaxKind.VoidKeyword
            ? `(e: '${e.name}'): void`
            : `(e: '${e.name}', detail: ${e.type.getText(
                analysisResult.sourceFile
              )}): void`
        )
        .join(', ')} }>()`
    : ''
}
</script>

<template>
<${prefix}-${kebabize(analysisResult.name)} ${analysisResult.props
    .map(
      (prop) =>
        `:${prop.name}="${
          prop.type.getText(analysisResult.sourceFile) === 'string'
            ? prop.name
            : `JSON.stringify(${prop.name})`
        }"`
    )
    .join(' ')} ${analysisResult.emits
    .map((e) =>
      e.type.kind === SyntaxKind.VoidKeyword
        ? `@${prefix}-${e.name}='()=>emit(\"${e.name}\")'`
        : `@${prefix}-${e.name}='(ev)=>emit(\"${e.name}\", ev.detail[0])'`
    )
    .join(' ')}><slot></slot></${prefix}-${kebabize(analysisResult.name)}>
</template>`
  return {
    code: [{ content: code, fileType: 'vue' }],
    exportCodeLine: `export {default as ${analysisResult.name}} from './${analysisResult.name}.vue'`,
    declarationLine: `export * as ${analysisResult.name} from './${analysisResult.name}.vue'`,
  }
}
