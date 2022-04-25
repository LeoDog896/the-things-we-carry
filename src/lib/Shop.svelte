<script lang="ts">
  import { clickAmount, friction, restitution, shopEnabled } from "./settings"
  import ShopButton from "./ShopButton.svelte"
  import SteppedShopButton from "./SteppedShopButton.svelte";
  import { derived } from "svelte/store"
  import { fly } from 'svelte/transition';
</script>
<div transition:fly={{ x: -50 }} class="font-display fixed top-0 left-0 h-[calc(100vh)] w-auto p-8 bg-gray-400/[0.6]">
  <h1 class="text-2xl mb-8 text-center">Shop <button class="ml-2 rounded-full py-2 px-4 bg-white hover:bg-red-400 transition-all text-black" on:click={() => {
    $shopEnabled = false
  }}>x</button></h1>

  <div class="flex flex-col">
    <ShopButton 
      on:successfullPurchase={() => $clickAmount = $clickAmount + 1}
      cost={derived(clickAmount, amount => amount * 30)}
      currentNumber={clickAmount}
    >Increase amount</ShopButton>
    <SteppedShopButton
      on:successfullPurchase={() => $friction = $friction + 0.1}
      cost={derived(friction, amount => amount * 200)}
      currentNumber={friction}
      max={1}
      nextStep={0.1}
    >Increase friction</SteppedShopButton>
    <SteppedShopButton 
      on:successfullPurchase={() => $restitution = $restitution - 0.1 }
      cost={derived(restitution, amount => (1.1 - amount) * 250)}
      currentNumber={restitution}
      negative={true}
      max={0}
      nextStep={-0.1}
    >Decrease Bounciness</SteppedShopButton>
  </div>
</div>
<svelte:window on:keydown={event => {
  if (event.key == "Esc" || event.key == "Escape") {
    $shopEnabled = false
  }
}}></svelte:window>