<script lang="ts">
  import { derived, type Readable, type Writable } from "svelte/store";

  import ShopButton from "./ShopButton.svelte"

  export let cost: Readable<number>
  export let currentNumber: Writable<number>
  export let nextStep: number
  export let max: number
  export let negative: boolean = false
</script>

<ShopButton
  on:successfullPurchase 
  {cost} {currentNumber} {max} {negative}
  nextNumber={derived(currentNumber, number => number + nextStep)}
>
  <slot></slot>
</ShopButton>