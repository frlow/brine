<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'stringevent', value: string): void
  (e: 'numevent', value: number): void
  (e: 'objevent', value: { value: string }): void
  (e: 'click'): void
}>()
</script>

<template>
  <button
      class="event-button"
      @click="
      () => {
        emit('stringevent', 'demo')
        emit('numevent', 5)
        emit('objevent', { value: 'val' })
        emit('click')
      }
    "
  >
    Vue Send event
  </button>
</template>
