<h3 class="color">Svelte {count + 1}</h3>
<my-tester obj={demo} text="svelte" on:my-event={ev=>handle(ev.detail)}></my-tester>

<script lang="ts">
  import {createEventDispatcher} from 'svelte'

  const dispatch = createEventDispatcher<{ 'my-event': string }>()

  const handle = (text: string) => {
    dispatch("my-event", text)
  }
  export let count: number = 12
  const demo = {value: 1}
</script>

<style>
    .color {
        color: #a0392a;
    }
</style>
