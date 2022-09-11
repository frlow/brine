<script setup lang="ts">
import SvelteEmits from '../../dist/lite-wrapper/vue/SvelteEmits.vue'

function log(e: any) {
  (window as any).log.push(e)
}
</script>
<template>
  <div id="test">
    <SvelteEmits
        @stringevent="e=>log(e)"
        @click="e=>log(e)"
        @objevent="e=>log(e)"
        @numevent="e=>log(e)"
    ></SvelteEmits>
  </div>
</template>