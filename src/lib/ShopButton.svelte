<script lang="ts">
  import Button from "./Button.svelte"
  import { createEventDispatcher } from 'svelte';
  import { units, removeUnits } from "./settings"
  import { type Readable, type Writable, derived } from "svelte/store"

  export let cost: Readable<number>
  export let currentNumber: Writable<number>
  export let nextNumber = derived(currentNumber, number => number + 1)
  export let max: number = Number.MAX_SAFE_INTEGER

  const dispatch = createEventDispatcher();

  function click() {
    if ($cost > $units) return
    removeUnits($cost)
    dispatch('successfullPurchase');
  }
</script>

<Button 
  disabled={$cost > $units || max <= $currentNumber}
  on:click={click}
>
  <slot/> 
  {#if max <= $currentNumber}
    <span> (Maxed Out!)</span>
  {:else}
    <span> ({$currentNumber} -> {Math.round($nextNumber * 100) / 100} - {Math.round($cost * 100) / 100} unit{$cost == 1 ? "" : "s"}])</span>
  {/if}
</Button>