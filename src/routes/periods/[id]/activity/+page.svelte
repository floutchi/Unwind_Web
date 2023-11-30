<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import type { SelectOption } from "$lib/SelectOptionType";
  import { checkData, createActivity } from "$lib/activities";
  import Button from "$lib/components/Button.svelte";
  import Input from "$lib/components/Input.svelte";
  import MessageCard from "$lib/components/MessageCard.svelte";
  import SelectInput from "$lib/components/SelectInput.svelte";
  import Title from "$lib/components/Title.svelte";
  import { countries } from "$lib/countries";
    import { onMount } from "svelte";
  import type { PageData } from "./$types";
    import { loadGooglePlace } from "$lib/LoadGooglePlace";
    import type { Place } from "$lib/place";

  export let data: PageData;
  const options: SelectOption[] = countries.map((c) => {
    return { name: c.name, value: c.code };
  });

  let message = "";

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

  async function handleSubmit(event: SubmitEvent) {
    message = "";
    const entries = new FormData(event.target as HTMLFormElement);
    const formData = Object.fromEntries(entries);

    const name = formData.name as string;
    const street = formData.street as string;
    const num = formData.num as string;
    const zip = formData.zip as string;
    const city = formData.city as string;
    const country = formData.country as string;

    try {
      checkData(name, street, num, zip, city, country);
      await createActivity(
        name,
        street,
        parseInt(num),
        zip,
        city,
        country,
        data.id
      );
      goto(`${base}/periods/${data.id}`);
    } catch (e: any) {
      message = e.message;
    }
  }
</script>

<svelte:head>
  <title>Nouvelle activité - Unwind</title>
</svelte:head>

<Title text="Nouvelle activité" />

{#if message !== ""}
  <MessageCard {message} isError />
{/if}
<form on:submit|preventDefault={handleSubmit} class="py-4">
  <Input title="Nom" name="name" type="text" isRequired />
  <Input title="Rechercher un lieu" name="address" type="text" />
  <Input value={streetInput} title="Rue" name="street" type="text" isRequired />
  <Input value={numInput} title="Numéro" name="num" type="number" isRequired />
  <Input value={zipInput} title="Code postal" name="zip" type="text" isRequired />
  <Input value={cityInput} title="Localité" name="city" type="text" isRequired />
  <SelectInput value={countryInput} title="Pays" name="country" {options} isRequired />
  <Button text="Ajouter" />
</form>
