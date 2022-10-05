import { SyntaxKind } from 'typescript'
import { kebabize } from '../../utils/kebabize'
import { GenerateWrapperFunction } from '../wrapper'
import { shouldSendAsString } from '../common/utils'

export const vueWrapperGenerator: GenerateWrapperFunction = async (
  analysisResult,
  prefix,
  importMode,
  importFile
) => {
  const code = `<script setup lang='ts'>
${importMode === 'auto' ? `import '${importFile}'` : ''}
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
${
  importMode === 'lazy'
    ? `import {onMounted} from 'vue'
// @ts-ignore
onMounted(()=>{import('${importFile}')})`
    : ''
}
</script>

<template>
<${prefix}-${kebabize(analysisResult.name)} ${analysisResult.props
    .map(
      (prop) =>
        `:${prop.name}="${
          shouldSendAsString(prop.type, analysisResult)
            ? prop.name
            : `JSON.stringify(${prop.name})`
        }"`
    )
    .join(' ')} ${analysisResult.emits
    .map((e) =>
      e.type.kind === SyntaxKind.VoidKeyword
        ? `@${prefix}-${e.name}='()=>emit(\"${e.name}\")'`
        : `@${prefix}-${e.name}='emit(\"${e.name}\", $event.detail[0])'`
    )
    .join(' ')}><slot></slot></${prefix}-${kebabize(analysisResult.name)}>
</template>`
  return {
    code: [{ content: code, fileType: 'vue' }],
    exportCodeLine: `export {default as ${analysisResult.name}} from './${analysisResult.name}.vue'`,
    declarationLine: `export * as ${analysisResult.name} from './${analysisResult.name}.vue'`,
  }
}
