<script lang="ts">
  import { checkEditData, editProfile, user } from "$lib/auth";
  import Button from "$lib/components/Button.svelte";
  import Title from "$lib/components/Title.svelte";
  import Input from "$lib/components/Input.svelte";
  import MessageCard from "$lib/components/MessageCard.svelte";
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";

  let message = "";

  async function handleSubmit(event: SubmitEvent) {
    message = "";
    const entries = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(entries);

    const firstName = data.firstName as string;
    const lastName = data.lastName as string;
    const email = data.email as string;
    const oldPassword = data.oldPassword as string;
    const newPassword = data.newPassword as string;
    const newPasswordConfirm = data.newPasswordConfirm as string;

    try {
      checkEditData(
        firstName,
        lastName,
        email,
        newPassword,
        newPasswordConfirm
      );
      await editProfile(
        firstName,
        lastName,
        email,
        oldPassword,
        newPassword,
        $user!.token
      );
      goto(`${base}/auth/account`);
    } catch (e: any) {
      message = e.message;
      return;
    }
  }
</script>

<svelte:head>
  <title>Editer mon compte - Unwind</title>
</svelte:head>

<Title text="Editer mon compte" />

{#if message !== ""}
  <MessageCard {message} isError />
{/if}

<form on:submit|preventDefault={handleSubmit} class="py-4">
  <Input
    title="Prénom"
    name="firstName"
    value={$user?.firstName}
    type="text"
    isRequired
  />
  <Input
    title="Nom"
    name="lastName"
    value={$user?.lastName}
    type="text"
    isRequired
  />
  <Input
    title="Adresse e-mail"
    name="email"
    value={$user?.email}
    type="email"
    isRequired
  />
  <MessageCard
    message="Laisser les champs de mot de passe vides si vous ne souhaitez pas le changer"
    isError={false}
  />
  <Input title="Ancien mot de passe" name="oldPassword" type="password" />
  <Input title="Nouveau mot de passe" name="newPassword" type="password" />
  <Input
    title="Confirmation nouveau mot de passe"
    name="newPasswordConfirm"
    type="password"
  />

  <Button text="Sauvegarder" />
</form>
