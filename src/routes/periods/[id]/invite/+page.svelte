<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import Button from "$lib/components/Button.svelte";
  import Chip from "$lib/components/Chip.svelte";
  import Input from "$lib/components/Input.svelte";
  import MessageCard from "$lib/components/MessageCard.svelte";
  import Title from "$lib/components/Title.svelte";
  import { isEmailValid } from "$lib/email";
  import { inviteUser } from "$lib/periods";
  import type { PageData } from "./$types";

  export let data: PageData;
  let users: string[] = [];
  let message = "";

  function handleSubmit(event: SubmitEvent) {
    message = "";
    const entries = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(entries);

    const email = data.email as string;

    if (!isEmailValid(email)) {
      message = "Format de l'adresse e-mail invalide";
      return;
    }

    if (!users.includes(email)) {
      users.push(email);
      users = users;
    }
  }

  function removeUser(email: string) {
    users = users.filter((u) => u !== email);
  }

  async function invite() {
    message = "";
    for (const user of users) {
      try {
        await inviteUser(user, data.id);
      } catch (e: any) {
        message = e.message;
        return;
      }
    }
    goto(`${base}/periods/${data.id}`);
  }
</script>

<svelte:head>
  <title>Inviter - Unwind</title>
</svelte:head>

<Title text="Inviter des personnes" />
{#if message !== ""}
  <MessageCard {message} isError />
{/if}
<form on:submit|preventDefault={handleSubmit} class="py-4">
  <Input
    title="Adresse e-mail de l'utilisateur à inviter"
    name="email"
    type="email"
    isRequired
  />
  <Button text="Ajouter" />
</form>
<div class="flex gap-2 w-[75%] overflow-hidden overflow-x-scroll py-2">
  {#each users as user}
    <Chip text={user} isRed={false} on:click={() => removeUser(user)} />
  {/each}
</div>
<div class="h-10" />
<Button text="Confirmer" on:click={invite} />
