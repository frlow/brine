<script lang="ts">
  import type {Complex} from "../types";

  export let stringprop: string
  export let numprop: number
  export let complexprop: Complex
  export let optionalprop: string = 'default'
</script>

<div>
    <div class="stringprop">{stringprop}</div>
    <div class="numprop">{numprop + 1}</div>
    <div class="complexprop">{complexprop?.value}</div>
    <div class="optionalprop">{optionalprop}</div>
</div>