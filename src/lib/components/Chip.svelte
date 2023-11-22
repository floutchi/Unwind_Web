<script lang="ts">
  import IconButton from "./IconButton.svelte";

  export let text: string;
  export let isRed: boolean;
</script>

<div
  class="flex items-center {isRed
    ? 'bg-red-200'
    : 'bg-gray-200'} rounded-full p-3 my-2"
>
  <p>{text}</p>
  <IconButton icon="close" title="Supprimer" on:click />
</div>
