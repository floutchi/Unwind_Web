<script lang="ts">
  import { user } from "$lib/auth";
  import Title from "$lib/components/Title.svelte";
  import Spinner from "$lib/components/Spinner.svelte";
  import { onMount } from "svelte";
  import PeriodList from "$lib/components/PeriodList.svelte";
  import { periods } from "$lib/periods";

  let periodsPromise: Promise<void>;

  onMount(() => {
    const unsubscribe = user.subscribe((u) => {
      if (u) {
        periodsPromise = periods.fetch();
      }
    });

    return unsubscribe;
  });
</script>

<svelte:head>
  <title>Mes vacances - Unwind</title>
</svelte:head>

<Title text="Mes vacances" />
{#await periodsPromise}
  <div class="w-full py-2 flex justify-center items-center">
    <Spinner />
  </div>
{:then}
  <PeriodList periods={$periods} />
{:catch err}
  <p class="text-center text-lg py-2 text-red-600">{err}</p>
{/await}
