<template>
  <div>
    <div class="box-style">
      <h5>Default</h5>
      <slot></slot>
    </div>
    <div class="box-style">
      <h5>Named</h5>
      <slot name="named"></slot>
    </div>
  </div>
</template>


<style>
.box-style {
  border: 1px solid red;
}
</style>