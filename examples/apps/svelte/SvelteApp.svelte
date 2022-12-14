<h3 class="color">Svelte {count + 1}</h3>
<my-tester obj={demo} text="svelte" on:my-event={ev=>console.log(ev)}></my-tester>

<script lang="ts">
  export let count: number = 12
  const demo = {value: 1}
</script>

<style>
    .color {
        color: #a0392a;
    }
</style>
