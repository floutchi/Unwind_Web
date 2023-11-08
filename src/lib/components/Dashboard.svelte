<script lang="ts">
  import type { VacationPeriod } from "$lib/periods";
  import Card from "./Card.svelte";

  export let period: VacationPeriod;

  let start = new Date(period.startDateTime);
  let end = new Date(period.endDateTime);
  let days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
</script>

<div class="grid grid-cols-2 gap-6">
  <!-- Place description -->
  <Card
    title="Lieu de vacances"
    subtitle="{period.place.street} {period.place.num}, {period.place
      .zipCode} {period.place.city} {period.place.country}"
    body=""
  />

  <!-- Dates et duration -->
  <Card
    title="Dates et durée"
    subtitle="Du {start.toLocaleDateString()} au {end.toLocaleDateString()}. ({days} jours)"
    body=""
  />

  <!-- Activities listing -->

  <!-- Weather data -->
</div>
