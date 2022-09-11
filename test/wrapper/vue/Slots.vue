<script setup lang="ts">
import SvelteSimple from '../../dist/lite-wrapper/vue/SvelteSimple.vue'
import SvelteSlots from '../../dist/lite-wrapper/vue/SvelteSlots.vue'
</script>
<template>
  <div id="test">
    <SvelteSlots>
      <SvelteSimple></SvelteSimple>
      <SvelteSimple slot="named"></SvelteSimple>
    </SvelteSlots>
  </div>
</template>