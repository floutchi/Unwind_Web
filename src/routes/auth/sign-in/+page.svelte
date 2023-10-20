<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { signIn, user } from "$lib/auth";
  import Button from "$lib/components/Button.svelte";
  import Input from "$lib/components/Input.svelte";
  import Title from "$lib/components/Title.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    const unsubscribe = user.subscribe((value) => {
      if (value) {
        goto(`${base}/periods`);
      }
    });

    return unsubscribe;
  });

  async function handleSubmit(event: SubmitEvent) {
    const entries = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(entries);

    const email = data.email as string;
    const password = data.password as string;

    await signIn(email, password);
  }
</script>

<svelte:head>
  <title>Connexion - Unwind</title>
</svelte:head>

<form class="p-10 shadow-xl rounded-lg" on:submit|preventDefault={handleSubmit}>
  <Title text="Connexion" />
  <Input title="Adresse e-mail" name="email" type="email" isRequired />
  <Input title="Mot de passe" name="password" type="password" isRequired />
  <Button text="Se connecter" />
</form>
