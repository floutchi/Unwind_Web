<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import BeachFriends from "$lib/assets/beach_friends.jpg";
  import ChatBubble from "$lib/assets/chat_bubble.jpg";
  import Graph from "$lib/assets/graph.jpg";
  import Button from "$lib/components/Button.svelte";
  import Input from "$lib/components/Input.svelte";
  import LandingSection from "$lib/components/LandingSection.svelte";
  import MessageCard from "$lib/components/MessageCard.svelte";
  import { getAppState } from "$lib/state";
  import { fetchTotalUsers, fetchUsersPerPeriod } from "$lib/stats";
  import { onMount } from "svelte";

  let user = getAppState().userStore.user;
  let totalUsers = 0;
  let usersPerPeriod: any | null = null;

  let fetchInterval: any = null;

  onMount(() => {
    const unsubscribe = user.subscribe((value) => {
      if (value) {
        goto(`${base}/periods`);
      }
    });

    fetchTotalUsers().then((v) => (totalUsers = v));

    setInterval(async () => {
      totalUsers = await fetchTotalUsers();
    }, 5000);

    return unsubscribe;
  });

  async function getStats(event: SubmitEvent) {
    const entries = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(entries);

    const start = data.start as string;
    const end = data.end as string;
    usersPerPeriod = await fetchUsersPerPeriod(start, end);
    clearInterval(fetchInterval);
    listenStats(start, end);
  }

  function listenStats(start: string, end: string) {
    fetchInterval = setInterval(async () => {
      usersPerPeriod = await fetchUsersPerPeriod(start, end);
    }, 5000);
  }
</script>

<svelte:head>
  <title>Voyagez organisé(e) - Unwind</title>
</svelte:head>

<div class="text-center">
  <h3
    class="py-2 text-5xl lg:text-6xl bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent"
  >
    Voyagez l'esprit tranquille
  </h3>
  <p class="py-2 text-lg lg:text-xl">
    Découvrez Unwind et ne partez plus jamais en vacances stressé(e).
  </p>
</div>
<LandingSection
  title="Une période de vacances, des activités et vos amis..."
  subtitle="Unwind est très simple à utiliser : pour partir en vacances l'esprit tranquille, il vous suffit de créer une période de vacances, d'ajouter vos amis, et de planifier des activités."
  imagePath={BeachFriends}
  imageAlt="Friends going to the beach"
/>
<LandingSection
  title="Discutez dans vos groupes en temps réel"
  subtitle="Pour bien s'organiser, une bonne communication est essentielle. C'est pourquoi, Unwind vous permet de discuter avec les autres membres d'un groupe en temps réel."
  imagePath={ChatBubble}
  imageAlt="A chat bubble illustration"
/>
<div class="py-20 flex flex-col lg:flex-row lg:justify-between lg:items-center">
  <div class="lg:p-10">
    <h3 class="py-2 text-3xl">
      {totalUsers} utilisateurs nous font déjà confiance !
    </h3>
    <p class="py-2 text-lg lg:text-xl">
      Unwind compte déjà une base d'utilisateurs solide. Découvrez combien de
      personne nous font confiance pour leurs vacances :
    </p>
    {#if usersPerPeriod}
      {#each Object.entries(usersPerPeriod) as entry}
        <MessageCard
          message="{entry[1]} personnes partent en vacances en {entry[0]}"
          isError={false}
        />
      {:else}
        <MessageCard
          message="Aucun utilisateur n'est en vacances durant cette période"
          isError={false}
        />
      {/each}
    {/if}
    <form on:submit|preventDefault={getStats} class="py-4">
      <Input title="Date de début" name="start" type="date" />
      <Input title="Date de fin" name="end" type="date" />
      <Button text="Valider" />
    </form>
  </div>
  <img
    class="py-4 md:max-w-md lg:max-w-md"
    src={Graph}
    alt="Graph illustration"
  />
</div>
