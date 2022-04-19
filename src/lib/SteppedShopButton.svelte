<script lang="ts">
  import { derived, type Readable, type Writable } from "svelte/store";

  import ShopButton from "./ShopButton.svelte"

  export let cost: Readable<number>
  export let currentNumber: Writable<number>
  export let nextStep: number
  export let max: number
</script>

<ShopButton
  on:successfullPurchase 
  {cost} {currentNumber} {max}
  nextNumber={derived(currentNumber, number => number + nextStep)}
>
  <slot></slot>
</ShopButton>