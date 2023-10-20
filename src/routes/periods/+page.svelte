<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { user } from "$lib/auth";
  import Title from "$lib/components/Title.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    const unsubscribe = user.subscribe((value) => {
      if (!value) {
        goto(base);
      }
    });

    return unsubscribe;
  });
</script>

<svelte:head>
  <title>Mes vacances - Unwind</title>
</svelte:head>

<Title text="Mes vacances" />
