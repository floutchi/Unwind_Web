<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import type { PageData } from "./$types";
  import type { SelectOption } from "$lib/SelectOptionType";
  import Button from "$lib/components/Button.svelte";
  import Input from "$lib/components/Input.svelte";
  import MessageCard from "$lib/components/MessageCard.svelte";
  import SelectInput from "$lib/components/SelectInput.svelte";
  import Title from "$lib/components/Title.svelte";
  import { countries } from "$lib/countries";
  import { checkData, type VacationPeriod } from "$lib/periods";
  import { onMount } from "svelte";
  import { loadGooglePlace } from "$lib/LoadGooglePlace";
  import type { Place } from "$lib/place";
  import { getAppState } from "$lib/state";
  import { verifyAuth } from "$lib/verify";

  export let data: PageData;
  let state = getAppState();
  let user = state.userStore.user;
  let periods = state.periodStore;
  let period: VacationPeriod | null;

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
    verifyAuth(state.userStore);
    loadGooglePlace(onPlaceChanged);

    const unsubscribe = user.subscribe((u) => {
      if (u) {
        period = periods.getPeriod(parseInt(data.id));

        if (period) {
          streetInput = period.place.street;
          numInput = period.place.num.toString();
          zipInput = period.place.zipCode;
          cityInput = period.place.city;
          countryInput = period.place.country;
        }
      }
    });

    return unsubscribe;
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
    const inputData = Object.fromEntries(entries);

    const name = inputData.name as string;
    const start = inputData.start as string;
    const end = inputData.end as string;
    const street = inputData.street as string;
    const num = inputData.num as string;
    const zip = inputData.zip as string;
    const city = inputData.city as string;
    const country = inputData.country as string;

    try {
      checkData(name, start, end, street, num, zip, city, country);
      await periods.edit(
        parseInt(data.id),
        name,
        start,
        end,
        street,
        parseInt(num),
        zip,
        city,
        country,
        $user!.token
      );
      await goto(`${base}/periods/${data.id}`);
    } catch (e: any) {
      message = e.message;
    }
  }
</script>

<svelte:head>
  <title>Editition de vacances - Unwind</title>
</svelte:head>

{#if message}
  <MessageCard {message} isError />
{/if}

<Title text="Modifier {period?.name ?? ''}" />

<form on:submit|preventDefault={handleSubmit} class="py-4">
  <Input title="Nom" name="name" type="text" value={period?.name} isRequired />
  <Input
    title="Date de début"
    name="start"
    value={period?.startDateTime.split("T")[0]}
    type="date"
    isRequired
  />
  <Input
    title="Date de fin"
    name="end"
    value={period?.endDateTime.split("T")[0]}
    type="date"
    isRequired
  />

  <Input title="Rechercher un lieu" name="address" type="text" />
  <Input title="Rue" name="street" value={streetInput} type="text" isRequired />
  <Input title="Numéro" name="num" value={numInput} type="number" isRequired />
  <Input
    title="Code postal"
    name="zip"
    value={zipInput}
    type="text"
    isRequired
  />
  <Input
    title="Localité"
    name="city"
    value={cityInput}
    type="text"
    isRequired
  />
  <SelectInput
    title="Pays"
    name="country"
    value={countryInput}
    {options}
    isRequired
  />
  <Button text="Sauvegarder" />
</form>
