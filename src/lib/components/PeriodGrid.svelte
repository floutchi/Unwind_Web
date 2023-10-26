<script lang="ts">
  import type { VacationPeriod } from "$lib/periods";
  import Card from "./Card.svelte";

  export let periods: VacationPeriod[];
</script>

<div class="grid grid-cols-3 gap-4">
  {#each periods as period (period.idHoliday)}
    <Card
      title={period.name}
      subtitle={`${period.place.street} ${period.place.num}, ${period.place.country}`}
      body="Du {new Date(
        period.startDateTime
      ).toLocaleDateString()} au {new Date(
        period.endDateTime
      ).toLocaleDateString()}<br />{period.participants.length} participants"
      url="/periods/{period.idHoliday}"
    />
  {/each}
</div>
