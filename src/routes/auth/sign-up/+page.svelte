<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { checkData } from "$lib/auth";
  import Button from "$lib/components/Button.svelte";
  import GoogleButton from "$lib/components/GoogleButton.svelte";
  import Input from "$lib/components/Input.svelte";
  import MessageCard from "$lib/components/MessageCard.svelte";
  import Title from "$lib/components/Title.svelte";
  import { getAppState } from "$lib/state";
  import { onMount } from "svelte";

  let userStore = getAppState().userStore;
  let message = "";

  onMount(() => {
    const unsubscribe = userStore.user.subscribe((value) => {
      if (value) {
        goto(`${base}/periods`);
      }
    });

    return unsubscribe;
  });

  async function handleSubmit(event: SubmitEvent) {
    message = "";
    const entries = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(entries);

    const firstName = data.firstName as string;
    const lastName = data.lastName as string;
    const email = data.email as string;
    const password = data.password as string;
    const passwordConfirm = data.passwordConfirm as string;

    try {
      checkData(firstName, lastName, email, password, passwordConfirm);
      await userStore.signUp(firstName, lastName, email, password);
    } catch (e: any) {
      message = e.message;
      return;
    }
  }
</script>

<svelte:head>
  <title>Inscription - Unwind</title>
</svelte:head>

<Title text="Inscription" />
{#if message !== ""}
  <MessageCard {message} isError />
{/if}

<div class="py-4 border-b-2 border-gray-200">
  <GoogleButton />
</div>

<form on:submit|preventDefault={handleSubmit} class="py-4">
  <Input title="Prénom" name="firstName" type="text" isRequired />
  <Input title="Nom" name="lastName" type="text" isRequired />
  <Input title="Adresse e-mail" name="email" type="email" isRequired />
  <Input title="Mot de passe" name="password" type="password" isRequired />
  <Input
    title="Confirmation du mot de passe"
    name="passwordConfirm"
    type="password"
    isRequired
  />
  <Button text="Créer le compte" />
</form>
