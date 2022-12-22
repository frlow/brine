<div>
    <button on:click={()=>dispatch("my-event", "my event!")}>{text} {myProp?.prop}</button>
</div>

<script lang="ts">
  import {createEventDispatcher, onDestroy} from 'svelte'

  export let text: string
  export let obj: { val: number }
  export let myProp: { prop: string }
  const dispatch = createEventDispatcher<{
    'my-event': string
  }>()
  $: {
    console.log("fw", text)
    console.log("obj", obj)
  }
  onDestroy(() => console.log("destroy", text))
</script>

<style>
</style>
