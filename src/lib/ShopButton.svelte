<script lang="ts">
  import Button from "./Button.svelte"
  import { createEventDispatcher } from 'svelte';
  import { units, removeUnits } from "./settings"
  import { type Readable, type Writable, derived } from "svelte/store"

  export let cost: Readable<number>
  export let currentNumber: Writable<number>
  export let nextNumber = derived(currentNumber, number => number + 1)
  export let max: number = Number.MAX_SAFE_INTEGER

  $: disabled = $cost > $units || max <= $currentNumber

  const dispatch = createEventDispatcher();

  function click() {
    if ($cost > $units) return
    removeUnits($cost)
    dispatch('successfullPurchase');
  }
</script>

<Button 
  {disabled}
  on:click={click}
  extraClasses={disabled ? "cursor-not-allowed text-gray-700" : ""}
>
  <slot/> 
  <br>
  {#if max <= $currentNumber}
    <span class="text-xs {disabled ? "text-gray-500" : "text-gray-700"}"> (Maxed Out!)</span>
  {:else}
    <span class="text-xs {disabled ? "text-red-700" : "text-green-700"}"> ({$currentNumber} -> {Math.round($nextNumber * 100) / 100} - {Math.round($cost * 100) / 100} unit{$cost == 1 ? "" : "s"}])</span>
  {/if}
</Button>