<script lang="ts">
  import Title from "$lib/components/Title.svelte";
  import Spinner from "$lib/components/Spinner.svelte";
  import { onMount } from "svelte";
  import PeriodList from "$lib/components/PeriodList.svelte";
  import { getAppState } from "$lib/state";
  import { verifyAuth } from "$lib/verify";

  let state = getAppState();
  let user = state.userStore.user;
  let periods = state.periodStore;
  let periodsPromise: Promise<void>;

  onMount(() => {
    verifyAuth(state.userStore);

    const unsubscribe = user.subscribe((u) => {
      if (u) {
        periodsPromise = periods.fetch(u.token);
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
