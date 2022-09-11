<script setup lang="ts">
import SvelteProps from '../../dist/lite-wrapper/vue/SvelteProps.vue'
</script>
<template>
  <div id="test">
    <SvelteProps
        :stringprop="'str'"
        :numprop="6"
        :complexprop="{ value: 'val' }"
    ></SvelteProps>
  </div>
</template>