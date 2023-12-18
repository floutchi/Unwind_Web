<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import Button from "$lib/components/Button.svelte";
  import Title from "$lib/components/Title.svelte";
  import { getAppState } from "$lib/state";
  import { verifyAuth } from "$lib/verify";
  import { onMount } from "svelte";

  let userStore = getAppState().userStore;
  let periodStore = getAppState().periodStore;
  let user = userStore.user;

  onMount(() => verifyAuth(userStore));

  function handleSignout() {
    periodStore.clear();
    userStore.signOut();
  }
</script>

<svelte:head>
  <title>Mon compte - Unwind</title>
</svelte:head>

<Title text="Mon compte" />
<div class="p-10 shadow-xl rounded-lg">
  <p class="py-2">
    <span class="font-semibold">Prénom</span> : {$user?.firstName}
  </p>
  <p class="py-2"><span class="font-semibold">Nom</span> : {$user?.lastName}</p>
  <p class="py-2">
    <span class="font-semibold">Adresse e-mail</span> : {$user?.email}
  </p>
  <Button
    text="Editer profil"
    on:click={() => goto(`${base}/auth/account/edit`)}
  />
  <Button text="Se déconnecter" on:click={handleSignout} />
</div>
