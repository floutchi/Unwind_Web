<script lang="ts">
  export let temperature: number;
  export let weatherDesc: string;
  export let iconId: string;
  export let date: string;
</script>

<div class="p-10 m-4 shadow-xl rounded-lg w-full">
  <p class="py-2 text-lg">{new Date(date).toLocaleDateString()}</p>
  <p class="text-3xl py-2">{temperature} °C</p>
  <p class="py-2 text-lg">{weatherDesc}</p>
  <img
    alt="Weather icon"
    src={`http://openweathermap.org/img/w/${iconId}.png`}
  />
</div>
