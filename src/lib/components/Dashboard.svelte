<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { downloadiCal, type VacationPeriod } from "$lib/periods";
  import { getAppState } from "$lib/state";
  import ActivitySection from "./ActivitySection.svelte";
  import Card from "./Card.svelte";
  import IconButton from "./IconButton.svelte";
  import Popup from "./Popup.svelte";
  import WeatherSection from "./WeatherSection.svelte";

  export let period: VacationPeriod;
  let periods = getAppState().periodStore;

  let start = new Date(period.startDateTime);
  let end = new Date(period.endDateTime);
  let days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  let showPop = false;

  async function deletePeriodConfirm() {
    showPop = false;
    await periods.delete(period.idHoliday);
    goto(`${base}/periods`);
  }

  async function downloadCalendar() {
    const blob = await downloadiCal(period.idHoliday);

    const url = window.URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;

    downloadLink.download = `${period.name}.ics`;
    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(url);
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
    title="Editer la période de vacances"
    on:click={() => goto(`${base}/periods/${period.idHoliday}/edit`)}
  />

  <IconButton
    icon="delete"
    title="Supprimer la période de vacances"
    on:click={() => (showPop = true)}
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
    <ActivitySection
      activities={period.activities}
      periodId={period.idHoliday}
      on:download={downloadCalendar}
    />
  </Card>

  <!-- Weather data -->
  <Card
    title="Prévisions météo"
    subtitle="Les prévisions météorologiques sur place"
  >
    <WeatherSection weather={period.weather ?? []} />
  </Card>

  {#if showPop}
    <Popup
      title="Supprimer la période de vacances"
      body="Êtes-vous sûr de vouloir supprimer cette période de vacances ?"
      on:close={() => (showPop = false)}
      on:confirm={deletePeriodConfirm}
    />
  {/if}
</div>
