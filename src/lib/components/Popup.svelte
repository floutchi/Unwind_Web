<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import IconButton from "./IconButton.svelte";
  import Button from "./Button.svelte";

  export let title: string;
  export let body: string;

  const dispatch = createEventDispatcher();

  function close() {
    dispatch("close");
  }
</script>

<div class="fixed flex justify-center items-center inset-0 backdrop-blur-sm">
  <div class="mx-auto p-10 rounded-md bg-white shadow-xl">
    <IconButton icon="close" title="Fermer le popup" on:click={close} />
    <h3 class="text-2xl py-2">{title}</h3>
    <p class="text-lg py-2">{body}</p>

    <Button text="Annuler" on:click={close} />
    <Button text="Confirmer" on:click={() => dispatch("confirm")} />
  </div>
</div>
