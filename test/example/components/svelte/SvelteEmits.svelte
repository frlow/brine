<script lang="ts">
  import {createEventDispatcher} from 'svelte';

  const dispatch = createEventDispatcher<{
    stringevent: string,
    numevent: number,
    objevent: { value: string },
    click: void
  }>();
</script>

<button class="event-button" on:click={()=>{
    dispatch("stringevent", "demo")
    dispatch("numevent", 5)
    dispatch("objevent", {value: "val"})
    dispatch("click")
}}>Svelte Send event
</button>
