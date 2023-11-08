<script lang="ts">
  import Title from "$lib/components/Title.svelte";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { user } from "$lib/auth";
  import { fetchPeriod, type VacationPeriod } from "$lib/periods";
  import Spinner from "$lib/components/Spinner.svelte";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import Dashboard from "$lib/components/Dashboard.svelte";

  export let data: PageData;
  let periodPromise: Promise<VacationPeriod>;

  onMount(() => {
    const unsubscribe = user.subscribe((u) => {
      if (u) {
        periodPromise = fetchPeriod(data.id, u.token);
      }
    });

    return unsubscribe;
  });
</script>

<svelte:head>
  <title>Période de vacances - Unwind</title>
</svelte:head>

{#if periodPromise}
  {#await periodPromise}
    <Spinner />
  {:then period}
    <Title text={period.name} />
    <Dashboard {period} />
  {:catch}
    {goto(`${base}/periods`)}
  {/await}
{/if}
