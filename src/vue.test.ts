import { testWrapper } from './common.test.js'
import { createOptions } from './vue.js'
import vuePlugin from 'esbuild-plugin-vue3'
import { createApp, h } from '@vue/runtime-dom'

const plugins: any[] = [vuePlugin()]
describe('vue', () => {
  testWrapper(
    (component, meta) =>
      createOptions(meta, (props) =>
        createApp({
          render: () => h(component, props),
        })
      ),
    {
      stringText: `<template><div>simple-string-text</div></template>`,
      stringProp: `<template><div>{{text}}</div></template><script setup lang="ts">defineProps<{text:string}>()</script>`,
      numProp: `<template><div>{{num+1}}</div></template><script setup lang="ts">defineProps<{num:number}>()</script>`,
      objProp: `<template><div>{{obj.val}}</div></template><script setup lang="ts">defineProps<{obj:{val:string}}>()</script>`,
      onMountProps: `<template></template><script setup lang="ts">const {text} = defineProps<{text:string}>(); console.log(text)</script>`,
      simpleEvent: `<template><button @click="handle" id="button"></button></template><script setup lang="ts">
const emit = defineEmits<{(e: 'my-event', id: string): void}>()
const handle = ()=>emit("my-event","simple")
</script>`,
      openClosed: '<template><div>open-closed</div></template>',
    },
    plugins,
    [],
    '.vue'
  )
})
