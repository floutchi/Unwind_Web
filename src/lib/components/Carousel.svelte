<script lang="ts">
  import WeatherCard from "./WeatherCard.svelte";

  import IconButton from "./IconButton.svelte";
  import type { Weather } from "$lib/weather";

  export let weathers: Weather[] | undefined;
  $: weather = weathers![index];
  let index = 0;

  function next() {
    index = (index + 1) % weathers!.length;
  }

  function back() {
    const newIndex = index - 1;

    if (newIndex < 0) {
      index = weathers!.length + newIndex;
    } else {
      index = newIndex;
    }
  }
</script>

<div class="flex flex-col md:flex-row">
  <IconButton icon="arrow_back_ios" title="next" on:click={back} />
  <WeatherCard
    temperature={weather.temperature}
    weatherDesc={weather.weatherDesc}
    iconId={weather.iconId}
    date={weather.date}
  />
  <IconButton icon="arrow_forward_ios" title="back" on:click={next} />
</div>
