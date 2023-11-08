<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { user } from "$lib/auth";
  import Title from "$lib/components/Title.svelte";
  import Spinner from "$lib/components/Spinner.svelte";
  import { fetchPeriods, type VacationPeriod } from "$lib/periods";
  import { onMount } from "svelte";
  import PeriodList from "$lib/components/PeriodList.svelte";
  import Fab from "$lib/components/FAB.svelte";

  let periodsPromise: Promise<VacationPeriod[]>;

  onMount(() => {
    const unsubscribe = user.subscribe((u) => {
      if (u) {
        periodsPromise = fetchPeriods(u.token);
      }
    });

    return unsubscribe;
  });
</script>

<svelte:head>
  <title>Mes vacances - Unwind</title>
</svelte:head>

<Title text="Mes vacances" />
{#if periodsPromise}
  {#await periodsPromise}
    <div class="w-full py-2 flex justify-center items-center">
      <Spinner />
    </div>
  {:then periods}
    <PeriodList {periods} />
  {:catch err}
    <p class="text-center text-lg py-2 text-red-600">{err}</p>
  {/await}
{/if}

<Fab
  icon="add"
  title="Ajouter des vacances"
  on:click={() => goto(`${base}/periods/new`)}
/>
