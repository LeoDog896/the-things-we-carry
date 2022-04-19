<script lang="ts">
  export let extraClasses = "";
</script>

<button class="px-4 py-2 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 rounded-lg {extraClasses}" on:click>
  <slot></slot>
</button>