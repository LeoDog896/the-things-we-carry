<script lang="ts">
  import { clickAmount, friction, restitution } from "./settings"
  import ShopButton from "./ShopButton.svelte"
  import SteppedShopButton from "./SteppedShopButton.svelte";
  import { derived } from "svelte/store"
</script>
<div class="font-display">
  <h1 class="text-2xl mb-8">Shop</h1>

  <div class="block">
    <ShopButton 
      on:successfullPurchase={() => $clickAmount = $clickAmount + 1}
      cost={derived(clickAmount, amount => amount * 30)}
      currentNumber={clickAmount}
    >Increase amount </ShopButton>
    <SteppedShopButton
      on:successfullPurchase={() => $friction = $friction + 0.1}
      cost={derived(friction, amount => amount * 200)}
      currentNumber={friction}
      max={1}
      nextStep={0.1}
    >Increase friction </SteppedShopButton>
    <SteppedShopButton 
      on:successfullPurchase={() => $restitution = $restitution - 0.1 }
      cost={derived(restitution, amount => (1.1 - amount) * 300)}
      currentNumber={restitution}
      negative={true}
      max={0}
      nextStep={-0.1}
    >Decrease Bounciness</SteppedShopButton>
  </div>
</div>