<div>{count} {text} {obj?.val}</div>
<button class="button" on:click={()=>dispatch("my-event", "svelte demo")}>Button</button>
<svelte:element this="slot" name="foo"/>
<svelte:element this="slot"/>
<Child></Child>

<script lang="ts">
  import Child from "./Child.svelte";
  import {createEventDispatcher, onMount, onDestroy} from 'svelte'

  onMount(() => console.log("Svelte mount"))
  onDestroy(() => console.log("Svelte unmount"))
  const dispatch = createEventDispatcher<{ "my-event": string }>()
  export let count: number = 12
  export let obj: { val: string }
  export let text: string
</script>

<style>
    .button {
        color: aquamarine;
    }
</style>
