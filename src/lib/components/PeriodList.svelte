<script lang="ts">
  import type { VacationPeriod } from "$lib/periods";
  import Card from "./Card.svelte";

  export let periods: VacationPeriod[];
</script>

<div class="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-4">
  {#each periods as period (period.idHoliday)}
    <Card
      title={period.name}
      subtitle={`${period.place.street} ${period.place.num}, ${period.place.country}`}
      body="Du {new Date(
        period.startDateTime
      ).toLocaleDateString()} au {new Date(
        period.endDateTime
      ).toLocaleDateString()}<br />{period.participants.length} participant(s)"
      url="/periods/{period.idHoliday}"
    />
  {:else}
    <p class="py-2 text-lg">
      Vous n'avez aucune période de vacances. Appuyez sur le bouton "+" pour en
      créer une.
    </p>
  {/each}
</div>
