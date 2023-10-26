<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { user } from "$lib/auth";
  import Title from "$lib/components/Title.svelte";
  import Spinner from "$lib/components/Spinner.svelte";
  import { fakePeriods, fetchPeriods, type VacationPeriod } from "$lib/periods";
  import { onMount } from "svelte";
  import PeriodGrid from "$lib/components/PeriodGrid.svelte";

  let periodsPromise: Promise<VacationPeriod[]>;

  onMount(() => {
    const unsubscribe = user.subscribe((value) => {
      if (!value) {
        goto(base);
      } else {
        periodsPromise = fetchPeriods(value.token);
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
    <PeriodGrid periods={fakePeriods} />
  {:catch err}
    <p class="text-center text-lg py-2 text-red-600">{err}</p>
  {/await}
{/if}
