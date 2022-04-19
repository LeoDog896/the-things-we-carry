<script lang="ts">
  import { clickAmount } from "./settings"
  import Button from "./Button.svelte"
</script>
<div class="font-display">
  <h1 class="text-2xl">Shop</h1>

  <div class="block">
    <Button>Increase Friction</Button>
    <Button on:click={() => $clickAmount++}>Increase amount ()</Button>
  </div>
</div>