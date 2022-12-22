<h3 class="color">Svelte {count + 1}</h3>
<div>{myProp?.example}</div>
<my-tester obj={demo} text={`svelte ${count}`} on:my-event={ev=>console.log(ev)}
           my-prop={({prop:"SvelteProp"})}></my-tester>

<script lang="ts">
  export let count: number = 12
  export let myProp: { example: string }
  const demo = {value: 1}
</script>

<style>
    .color {
        color: #a0392a;
    }
</style>
