<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { deleteActivity, type Activity } from "$lib/activities";
  import { createEventDispatcher } from "svelte";
  import Button from "./Button.svelte";
  import IconButton from "./IconButton.svelte";
  import ListItem from "./ListItem.svelte";
  import Popup from "./Popup.svelte";
  import { getAppState } from "$lib/state";

  const dispatch = createEventDispatcher();

  export let activities: Activity[];
  export let periodId: number;

  let user = getAppState().userStore.user;
  let ascending = true;
  let showPop = false;
  let selectedId: number;

  function updateOrder() {
    ascending = !ascending;
    activities = activities.sort((a, b) => {
      if (ascending) {
        if (a.startDateTime && b.startDateTime)
          return a.startDateTime.localeCompare(b.startDateTime);

        if (a.startDateTime) return -1;

        if (b.startDateTime) return 1;

        return 0;
      }

      if (a.startDateTime && b.startDateTime)
        return b.startDateTime.localeCompare(a.startDateTime);

      if (a.startDateTime) return 1;

      if (b.startDateTime) return -1;

      return 0;
    });
  }

  async function deleteActivityConfirm() {
    showPop = false;
    await deleteActivity(periodId, selectedId!, $user!.token);
    activities = activities.filter((a) => a.idActivity !== selectedId);
  }
</script>

<IconButton
  icon="swap_vert"
  title={ascending
    ? "Trier par ordre décroissant"
    : "Trier par ordre croissant"}
  on:click={updateOrder}
/>
<Button
  text="Ajouter"
  on:click={() => goto(`${base}/periods/${periodId}/activity`)}
/>
<Button text="Télécharger" on:click={() => dispatch("download")} />

<ul class="py-4">
  {#each activities as activity}
    <ListItem
      title={activity.name}
      subtitle={activity.startDateTime && activity.endDateTime
        ? `${new Date(activity.startDateTime).toLocaleString()} - ${new Date(
            activity.endDateTime
          ).toLocaleString()}`
        : "Non planifié"}
      content="{activity.place.street} {activity.place.num}, {activity.place
        .zipCode} {activity.place.city}"
      on:edit={() =>
        goto(
          `${base}/periods/${periodId}/activity/${activity.idActivity}/edit`
        )}
      on:delete={() => {
        showPop = true;
        selectedId = activity.idActivity ?? -1;
      }}
    />
  {/each}
</ul>

{#if showPop}
  <Popup
    title="Supprimer l'activité"
    body="Êtes-vous sûr de vouloir supprimer cette activité ?"
    on:close={() => (showPop = false)}
    on:confirm={deleteActivityConfirm}
  />
{/if}
