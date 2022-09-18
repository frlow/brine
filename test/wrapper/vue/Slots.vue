<script setup lang="ts">
import SvelteSimple from '../../dist/wrapper/vue/SvelteSimple.lite.vue'
import SvelteSlots from '../../dist/wrapper/vue/SvelteSlots.lite.vue'
</script>
<template>
  <div id="test">
    <SvelteSlots>
      <SvelteSimple></SvelteSimple>
      <SvelteSimple slot="named"></SvelteSimple>
    </SvelteSlots>
  </div>
</template>