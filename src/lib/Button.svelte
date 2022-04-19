<script lang="ts">
  export let extraClasses = "";
  export let disabled = false;
</script>

<button class="
px-4 py-2 bg-gray-200 disabled:bg-gray-300
hover:bg-gray-300 active:bg-gray-400 rounded-lg
diabled:active:bg-gray-300
 {extraClasses}" on:click {disabled}>
  <slot></slot>
</button>