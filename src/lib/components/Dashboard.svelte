<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import type { VacationPeriod } from "$lib/periods";
  import Button from "./Button.svelte";
  import Card from "./Card.svelte";
  import IconButton from "./IconButton.svelte";
  import ListItem from "./ListItem.svelte";

  export let period: VacationPeriod;

  let start = new Date(period.startDateTime);
  let end = new Date(period.endDateTime);
  let days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
</script>

<div class="flex gap-2 items-center">
  <p class="text-lg">
    Avec {period.participants
      .map((p) => `${p.firstName} ${p.lastName}`)
      .join(", ")}
  </p>
  <IconButton
    icon="group_add"
    title="Inviter des personnes"
    on:click={() => goto(`${base}/periods/${period.idHoliday}/invite`)}
  />
  <IconButton
    icon="group_remove"
    title="Inviter des personnes"
    on:click={() => goto(`${base}/periods/${period.idHoliday}/remove`)}
  />
  
  <IconButton
    icon="edit"
    title="Editer période de vacances"
    on:click={() => goto(`${base}/periods/${period.idHoliday}/edit`)}
  />
  
  <IconButton
    icon="chat"
    title="tchat"
    on:click={() => goto(`${base}/periods/${period.idHoliday}/tchat`)}
  />
</div>
<div class="grid grid-cols-2 gap-6">
  <!-- Place description -->
  <Card
    title="Lieu de vacances"
    subtitle="{period.place.street} {period.place.num}, {period.place
      .zipCode} {period.place.city} {period.place.country}"
  />

  <!-- Dates et duration -->
  <Card
    title="Dates et durée"
    subtitle="Du {start.toLocaleDateString()} au {end.toLocaleDateString()}. ({days} jours)"
  />

  <!-- Activities listing -->
  <Card
    title="Activités prévues"
    subtitle="La liste des activités prévues sur place"
  >
    <Button
      text="Ajouter"
      on:click={() => goto(`${base}/periods/${period.idHoliday}/activity`)}
    />

    <ul class="py-4">
      {#each period.activities as activity}
        <ListItem
          title={activity.name}
          subtitle={activity.start && activity.end
            ? `${new Date(activity.start).toLocaleString()} - ${new Date(
                activity.end
              ).toLocaleDateString()}`
            : "Non planifié"}
          content="{activity.place.street} {activity.place.num}, {activity.place
            .zipCode} {activity.place.city}"
        />
      {/each}
    </ul>
  </Card>

  <!-- Weather data -->
  <Card title="Prévisions météo" subtitle="" />
</div>
