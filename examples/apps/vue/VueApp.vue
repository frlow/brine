<template>
  <div class="counter">{{ count }} {{ text }} {{ obj?.val }}</div>
  <button @click="handle">Button</button>
  <component is="slot" name="foo"></component>
  <component is="slot"></component>
  <Child/>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted} from 'vue'
import Child from './Child.vue'

onMounted(() => console.log("Vue Mount"))
onUnmounted(() => console.log("Vue Unmount"))

const handle = () => {
  emit("my-event", "demo")
}
defineProps<{ count: number, text: string, obj: { val: string } }>()
const emit = defineEmits<{
  (e: 'my-event', detail: string): void
}>()
</script>

<style scoped>
.counter {
  color: firebrick;
}
</style>
