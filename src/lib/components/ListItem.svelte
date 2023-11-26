<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import IconButton from "./IconButton.svelte";

  export let title: string;
  export let subtitle: string;
  export let content: string;

  const dispatch = createEventDispatcher();
</script>

<li class="border border-gray-200 p-3 rounded-md">
  <h5 class="text-lg font-semibold">{title}</h5>
  <h6>{subtitle}</h6>
  <p class="py-2">{content}</p>
  <IconButton icon="edit" title="Editer" on:click={() => dispatch("edit")} />
  <IconButton
    icon="delete"
    title="Supprimer"
    on:click={() => dispatch("delete")}
  />
</li>
