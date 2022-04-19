<script lang="ts">
  import { clickAmount } from "./settings"
  import ShopButton from "./ShopButton.svelte"
  import { derived } from "svelte/store"
</script>
<div class="font-display">
  <h1 class="text-2xl">Shop</h1>

  <div class="block">
    <ShopButton 
      on:successfullPurchase={() => $clickAmount = $clickAmount + 1}
      cost={derived(clickAmount, amount => amount * 50)}
      currentNumber={clickAmount}
      nextNumber={derived(clickAmount, amount => amount + 1)}
    >
      Increase amount 
    </ShopButton>
  </div>
</div>