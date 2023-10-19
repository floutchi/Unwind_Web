<script lang="ts">
  import BeachFriends from "$lib/assets/beach_friends.jpg";
  import ChatBubble from "$lib/assets/chat_bubble.jpg";
  import Graph from "$lib/assets/graph.jpg";
  import Input from "$lib/components/Input.svelte";
  import LandingSection from "$lib/components/LandingSection.svelte";

  function getStats() {
    console.log("Sumbitted!");
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
      Découvrez combien d'utilisateurs nous font déjà confiance !
    </h3>
    <p class="py-2 text-lg lg:text-xl">
      Unwind compte déjà une base d'utilisateurs solide. Découvrez combien de
      personne nous font confiance pour leurs vacances :
    </p>
    <form on:submit|preventDefault={getStats} class="py-4">
      <Input title="Date de début" name="start" type="date" />
      <Input title="Date de fin" name="end" type="date" />
      <input
        type="submit"
        value="Valider"
        class="py-2 px-4 my-2 bg-teal-500 text-white rounded-full hover:cursor-pointer"
      />
    </form>
  </div>
  <img
    class="py-4 md:max-w-md lg:max-w-md"
    src={Graph}
    alt="Graph illustration"
  />
</div>
