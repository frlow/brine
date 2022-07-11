<script lang="ts" setup>
const {
  enable
} = defineProps<{ enable?: boolean }>()
</script>

<template>
  <div>{{ enable ? "Enabled" : "Disabled" }}</div>
</template>