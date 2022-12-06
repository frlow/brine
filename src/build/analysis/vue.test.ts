import { testAnalyzer } from './common.test.js'
import { analyzeVueFile } from './vue.js'

describe('vue', () => {
  testAnalyzer(
    analyzeVueFile,
    {
      name: `<div></div>`,
      stringProp: `<script setup>defineProps<{str:string}>()</script>`,
      numberProp: `<script setup>defineProps<{num:number}>()</script>`,
      objectProp: `<script setup>defineProps<{obj:{val:string}}>()</script>`,
      literalProp: `<script setup>defineProps<{ literal: 'a'|'b'}>()</script>`,
      optionalProp: `<script setup>defineProps<{ optional?: string}>()</script>`,
      multipleProps: `<script setup>defineProps<{ a:string,b:number}>()</script>`,
      camelNameProp: `<script setup>defineProps<{ camelName: string}>()</script>`,
      kebabNameProp: `<script setup>defineProps<{ "kebab-name": string}>()</script>`,
      exoticNameProp: `<script setup>defineProps<{ ex0t_ic: string}>()</script>`,
      stringEmit: `<script setup>const emit = defineEmits<{(e: str, detail: string): void}>()</script>`,
      numberEmit: `<script setup>const emit = defineEmits<{(e: num, detail: number): void}>()</script>`,
      objectEmit: `<script setup>const emit = defineEmits<{(e: obj, detail: {val:string}): void}>()</script>`,
      literalEmit: `<script setup>const emit = defineEmits<{(e: literal, detail: 'a'|'b'): void}>()</script>`,
      multipleEmits: `<script setup>const emit = defineEmits<{(e: a, detail: string): void, (e: b, detail: number): void}>()</script>`,
      camelNameEmit: `<script setup>const emit = defineEmits<{(e: camelName, detail:  string): void}>()</script>`,
      kebabNameEmit: `<script setup>const emit = defineEmits<{(e: "kebab-name", detail:  string): void}>()</script>`,
      exoticNameEmit: `<script setup>const emit = defineEmits<{(e: ex0t_ic, detail:  string): void}>()</script>`,
      noSlots: `<template><div></div></template>`,
      defaultSlot: `<template><div><component is="slot"></component></div></template>`,
      namedSlot: `<template><div><component is="slot" name="named"></component></div></template>`,
      multipleNamedSlots: `<template><div><component is="slot" name="a"></component><component is="slot" name="b"></component></div></template>`,
    },
    'MyApp.vue'
  )
})
