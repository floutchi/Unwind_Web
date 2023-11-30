<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { loadGooglePlace } from "$lib/LoadGooglePlace";
  import type { SelectOption } from "$lib/SelectOptionType";
  import Button from "$lib/components/Button.svelte";
  import Input from "$lib/components/Input.svelte";
  import MessageCard from "$lib/components/MessageCard.svelte";
  import SelectInput from "$lib/components/SelectInput.svelte";
  import Title from "$lib/components/Title.svelte";
  import { countries } from "$lib/countries";
  import { checkData, periods } from "$lib/periods";
    import type { Place } from "$lib/place";
  import { onMount } from "svelte";

  const options: SelectOption[] = countries.map((c) => {
    return { name: c.name, value: c.code };
  });

  let streetInput = "";
  let numInput = "";
  let zipInput = "";
  let cityInput = "";
  let countryInput = "";

  onMount(() => {
    loadGooglePlace(onPlaceChanged);
  });

  function onPlaceChanged(place: Place) {
    streetInput = place.street;
    numInput = place.num.toString();
    zipInput = place.zipCode;
    cityInput = place.city;
    countryInput = place.country;
  }

  let message = "";

  async function handleSubmit(event: SubmitEvent) {
    message = "";
    const entries = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(entries);

    const name = data.name as string;
    const start = data.start as string;
    const end = data.end as string;
    const street = data.street as string;
    const num = data.num as string;
    const zip = data.zip as string;
    const city = data.city as string;
    const country = data.country as string;

    try {
      checkData(name, start, end, street, num, zip, city, country);
      await periods.create(
        name,
        start,
        end,
        street,
        parseInt(num),
        zip,
        city,
        country,
      );
      await goto(`${base}/periods`);
    } catch (e: any) {
      message = e.message;
    }
  }
</script>

<svelte:head>
  <title>Nouvelles vacances - Unwind</title>
</svelte:head>

<Title text="Nouvelles vacances" />
{#if message}
  <MessageCard {message} isError />
{/if}

<form on:submit|preventDefault={handleSubmit} class="py-4">
  <Input title="Nom" name="name" type="text" isRequired />
  <Input title="Date de début" name="start" type="date" isRequired />
  <Input title="Date de fin" name="end" type="date" isRequired />
  <Input title="Rechercher un lieu" name="address" type="text" />
  <Input value={streetInput} title="Rue" name="street" type="text" isRequired />
  <Input value={numInput} title="Numéro" name="num" type="number" isRequired />
  <Input
    value={zipInput}
    title="Code postal"
    name="zip"
    type="text"
    isRequired
  />
  <Input
    value={cityInput}
    title="Localité"
    name="city"
    type="text"
    isRequired
  />
  <SelectInput
    value={countryInput}
    title="Pays"
    name="country"
    {options}
    isRequired
  />
  <Button text="Créer" />
</form>
