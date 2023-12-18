<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import Button from "$lib/components/Button.svelte";
  import MessageCard from "$lib/components/MessageCard.svelte";
  import Title from "$lib/components/Title.svelte";
  import { removeUser } from "$lib/periods";
  import type { PageData } from "./$types";
  import Chip from "$lib/components/Chip.svelte";
  import { onMount } from "svelte";
  import { getAppState } from "$lib/state";
  import { verifyAuth } from "$lib/verify";

  export let data: PageData;
  let state = getAppState();
  let user = state.userStore.user;
  let periods = state.periodStore;
  let users: string[] = [];
  let usersToRemove: string[] = [];
  let message = "";

  onMount(() => {
    verifyAuth(state.userStore);

    const unsubscribe = user.subscribe((u) => {
      if (u) {
        users = periods
          .getPeriod(parseInt(data.id))
          .participants.map((p) => p.email);
      }
    });

    return unsubscribe;
  });

  function removeUserFromArray(email: string) {
    users = users.filter((u) => u !== email);
    usersToRemove.push(email);
    usersToRemove = usersToRemove;
  }

  function addUserToArray(email: string) {
    usersToRemove = usersToRemove.filter((u) => u !== email);
    users.push(email);
    users = users;
  }

  async function fetchRemove() {
    message = "";
    for (const u of usersToRemove) {
      try {
        await removeUser(u, data.id, $user!.token);
      } catch (e: any) {
        message = e.message;
        return;
      }
    }
    goto(`${base}/periods/${data.id}`);
  }
</script>

<svelte:head>
  <title>Supprimer des participants - Unwind</title>
</svelte:head>

<Title text="Supprimer des participants" />
{#if message !== ""}
  <MessageCard {message} isError />
{/if}
<div class="flex gap-2 w-[75%] overflow-hidden overflow-x-scroll py-2">
  {#each users as user}
    <Chip
      text={user}
      isRed={false}
      on:click={() => removeUserFromArray(user)}
    />
  {/each}
</div>
<div class="flex gap-2 w-[75%] overflow-hidden overflow-x-scroll py-2">
  {#each usersToRemove as user}
    <Chip text={user} isRed on:click={() => addUserToArray(user)} />
  {/each}
</div>
<div class="h-10" />

<Button text="Confirmer" on:click={fetchRemove} />
