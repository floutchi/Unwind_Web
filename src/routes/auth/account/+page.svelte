<script lang="ts">
  import { signOut, user } from "$lib/auth";
  import Button from "$lib/components/Button.svelte";
  import Title from "$lib/components/Title.svelte";
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
  <Button text="Se déconnecter" on:click={signOut} />
</div>
