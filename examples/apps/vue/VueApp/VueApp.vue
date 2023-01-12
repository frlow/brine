<template>
  <h3 class="color">Vue {{ count + 1 }}</h3>
  <my-tester :obj="demo" :text="`vue ${count}`" @my-event="ev=>log(ev)" :my-prop='myProp'>
  </my-tester>
</template>

<script lang="ts" setup>
defineProps<{ count: number }>()
const demo = {value: 8}
const log = console.log
const myProp = {prop: "VueProp"}
</script>

<style scoped>
.color {
  color: green;
}

</style>
