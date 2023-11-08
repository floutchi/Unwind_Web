<script lang="ts">
  import type { VacationPeriod } from "$lib/periods";
  import Card from "./Card.svelte";

  export let periods: VacationPeriod[];

  function parseDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
</script>

<div class="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-4">
  {#each periods as period (period.idHoliday)}
    <Card
      title={period.name}
      subtitle={`${period.place.street} ${period.place.num}, ${period.place.city}`}
      url="/periods/{period.idHoliday}"
    >
      <p>
        Du {parseDate(period.startDateTime)} au {parseDate(
          period.endDateTime
        )}<br />{period.participants.length} participant(s)
      </p>
    </Card>
  {:else}
    <p class="py-2 text-lg">
      Vous n'avez aucune période de vacances. Appuyez sur le bouton "+" pour en
      créer une.
    </p>
  {/each}
</div>
