<script lang="ts">
  import Button from "./Button.svelte"
  import { createEventDispatcher } from 'svelte';
  import { units, removeUnits } from "./settings"
  import { type Readable, type Writable, derived } from "svelte/store"

  export let cost: Readable<number>
  export let currentNumber: Writable<number>
  export let nextNumber: Readable<number> = derived(currentNumber, number => number + 1)

  const dispatch = createEventDispatcher();

  function click() {
    if ($cost > $units) return
    removeUnits($cost)
    dispatch('successfullPurchase');
  }
</script>

<Button 
  disabled={$cost > $units} 
  on:click={click}
>
  <slot/> ({$currentNumber} -> {$nextNumber} - {$cost} unit{$cost == 1 ? "" : "s"}])
</Button>