<script setup lang="ts">
import SvelteSimple from '../../dist/wrapper/vue/SvelteSimple.vue'
import SvelteSlots from '../../dist/wrapper/vue/SvelteSlots.vue'
</script>
<template>
  <div id="test">
    <SvelteSlots>
      <SvelteSimple></SvelteSimple>
      <SvelteSimple slot="named"></SvelteSimple>
    </SvelteSlots>
  </div>
</template>