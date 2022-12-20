<template>
  <h3 class="color">Vue {{ count + 1 }}</h3>
  <my-tester :obj="demo" text="vue" @my-event="ev=>emit('my-event', ev.detail)"></my-tester>
  <component is="slot"></component>
</template>

<script lang="ts" setup>
defineProps<{ count: number }>()
const emit = defineEmits<{
  (e: 'my-event', text: string): void
}>()
const demo = {value: 8}
</script>

<style scoped>
.color {
  color: green;
}
</style>
