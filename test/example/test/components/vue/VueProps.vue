<script lang="ts" setup>

const {
  stringprop,
  numprop,
  complexprop,
  optionalprop
} = defineProps<{ stringprop: string, numprop: number, complexprop: { value: string }, optionalprop?: string }>()
</script>

<template>
  <div>
    <div class="stringprop">{{ stringprop }}</div>
    <div class="numprop">{{ numprop + 1 }}</div>
    <div class="complexprop">{{ complexprop?.value }}</div>
    <div class="optionalprop">{{ optionalprop || 'default' }}</div>
  </div>
</template>