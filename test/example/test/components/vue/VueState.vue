<script setup lang="ts">
import {ref} from 'vue'

const increment = () =>
    count.value += 1
const count = ref(0)
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>