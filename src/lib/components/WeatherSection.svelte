<script lang="ts">
    import type { Weather } from "$lib/periods";
    import Card from "./Card.svelte";
    import Carousel from "./Carousel.svelte";

    export let weather: Weather[] | undefined;
</script>

<Card title="Prévisions météo" subtitle="">
    {#if weather?.length === 0}
        <p class="text-gray-700 py-4">
            Les données météo ne sont pas encore disponibles
        </p>
        <p class="text-gray-700 py-4">
            Elles seront disponibles 4 jours avant le début de la période de
            vacances
        </p>
    {:else}
        <Carousel weathers={weather} />
    {/if}
</Card>
