<script lang="ts">
  import { clickAmount, units } from "./settings"
  import Button from "./Button.svelte"

  function increaseClickAmount() {
    $clickAmount++
  }
</script>
<div class="font-display">
  <h1 class="text-2xl">Shop</h1>

  <div class="block">
    <Button>Increase Friction</Button>
    <Button on:click={increaseClickAmount} disabled={$clickAmount * 100 > $units}>
      Increase amount ({$clickAmount} -> {$clickAmount + 1} - {$clickAmount * 100} units)
    </Button>
  </div>
</div>