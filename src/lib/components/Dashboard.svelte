<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { deleteActivity } from "$lib/activities";
  import { deletePeriod, downloadiCal, type VacationPeriod } from "$lib/periods";
  import Button from "./Button.svelte";
  import Card from "./Card.svelte";
  import IconButton from "./IconButton.svelte";
  import ListItem from "./ListItem.svelte";
  import Popup from "./Popup.svelte";
  import WeatherSection from "./WeatherSection.svelte";

  export let period: VacationPeriod;

  let start = new Date(period.startDateTime);
  let end = new Date(period.endDateTime);
  let days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  let showPop: boolean = false;
  let selectedId: number | null;
  let isPeriod: boolean;

  function deletePeriodConfirm() {
    showPop = false;
    deletePeriod(period.idHoliday.toString());
    goto(`${base}/periods`);
  }

  function deleteActivityConfirm() {
    showPop = false;
    deleteActivity(period.idHoliday.toString(), selectedId!.toString());
  }

  function downloadCalendar() {
    downloadiCal(period.idHoliday.toString(), period.name);
  }
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
    icon="delete"
    title="Supprimer période de vacances"
    on:click={() => {
      showPop = true;
      isPeriod = true;
    }}
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
    <Button
      text="Télécharger"
      on:click={() => downloadCalendar()}
    />

    <ul class="py-4">
      {#each period.activities as activity}
        <ListItem
          title={activity.name}
          subtitle={activity.startDateTime && activity.endDateTime
            ? `${new Date(
                activity.startDateTime
              ).toLocaleString()} - ${new Date(
                activity.endDateTime
              ).toLocaleString()}`
            : "Non planifié"}
          content="{activity.place.street} {activity.place.num}, {activity.place
            .zipCode} {activity.place.city}"
          on:edit={() =>
            goto(
              `${base}/periods/${period.idHoliday}/activity/${activity.idActivity}/edit`
            )}
          on:delete={() => {
            showPop = true;
            selectedId = activity.idActivity;
            isPeriod = false;
          }}
        />
      {/each}
    </ul>
  </Card>

  {#if showPop}
    {#if isPeriod}
      <Popup
        title="Supprimer la période de vacances"
        body="Êtes-vous sûr de vouloir supprimer cette période de vacances ?"
        on:close={() => (showPop = false)}
        on:confirm={() => deletePeriodConfirm()}
      />
    {:else}
      <Popup
        title="Supprimer l'activité"
        body="Êtes-vous sûr de vouloir supprimer cette activité ?"
        on:close={() => (showPop = false)}
        on:confirm={() => deleteActivityConfirm()}
      />
    {/if}
  {/if}

  <!-- Weather data -->
  <WeatherSection weather={period.weather} />
</div>
