<script lang="ts" setup>

const {
  stringprop,
  numprop,
  complexprop,
  optionalprop,
  selectprop
} = defineProps<{ stringprop: string, numprop: number, complexprop: { value: string }, selectprop: 'a' | 'b', optionalprop?: string }>()
</script>

<template>
  <div>
    <div class="stringprop">{{ stringprop }}</div>
    <div class="numprop">{{ numprop + 1 }}</div>
    <div class="complexprop">{{ complexprop?.value }}</div>
    <div class="selectprop">{{ selectprop }}</div>
    <div class="optionalprop">{{ optionalprop || 'default' }}</div>
  </div>
</template>