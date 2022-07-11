<script lang="ts" setup>
import type {Complex} from "../types";

const {
  stringprop,
  numprop,
  complexprop,
  optionalprop
} = defineProps<{ stringprop: string, numprop: number, complexprop: Complex, optionalprop?: string }>()
</script>

<template>
  <div>
    <div class="stringprop">{{ stringprop }}</div>
    <div class="numprop">{{ numprop + 1 }}</div>
    <div class="complexprop">{{ complexprop?.value }}</div>
    <div class="optionalprop">{{ optionalprop || 'default' }}</div>
  </div>
</template>