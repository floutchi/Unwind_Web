<script lang="ts">
  import type { Weather } from "$lib/weather";
  import Card from "./Card.svelte";
  import IconButton from "./IconButton.svelte";

  export let weather: Weather[] | undefined;
  let index = 0;
  $: currentWeather = weather ? weather[index] : null;

  function next() {
    index = (index + 1) % weather!.length;
  }

  function back() {
    const newIndex = index - 1;

    if (newIndex < 0) {
      index = weather!.length + newIndex;
    } else {
      index = newIndex;
    }
  }
</script>

{#if weather?.length === 0}
  <p class="text-gray-700 py-4">
    Les données météo ne sont pas encore disponibles
  </p>
  <p class="text-gray-700 py-4">
    Elles seront disponibles 4 jours avant le début de la période de vacances
  </p>
{:else}
  <div class="flex flex-col md:flex-row gap-4">
    <IconButton icon="arrow_back_ios" title="next" on:click={back} />
    <Card
      title="{Math.round(currentWeather?.temperature ?? 0)}°C"
      subtitle={new Date(currentWeather?.date ?? "").toLocaleDateString()}
    >
      <p>{currentWeather?.weatherDesc ?? ""}</p>
      <img
        src="https://openweathermap.org/img/w/{currentWeather?.iconId}.png"
        alt="Weather pictogram"
      />
    </Card>
    <IconButton icon="arrow_forward_ios" title="back" on:click={next} />
  </div>
{/if}
