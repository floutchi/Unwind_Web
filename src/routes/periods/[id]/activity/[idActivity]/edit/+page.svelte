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
  import { checkData, editActivity, type Activity } from "$lib/activities";
  import { onMount } from "svelte";
  import { loadGooglePlace } from "$lib/LoadGooglePlace";
  import type { Place } from "$lib/place";
  import { getAppState } from "$lib/state";
  import { verifyAuth } from "$lib/verify";

  export let data: PageData;
  let state = getAppState();
  let user = state.userStore.user;
  let periods = state.periodStore;
  let activity: Activity;

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
        const a = periods
          .getPeriod(parseInt(data.id))
          .activities.find((a) => a.idActivity === parseInt(data.idActivity))!;

        if (!a) {
          goto(`${base}/periods/`);
        }

        activity = a;

        if (activity) {
          streetInput = activity.place.street;
          numInput = activity.place.num.toString();
          zipInput = activity.place.zipCode;
          cityInput = activity.place.city;
          countryInput = activity.place.country;
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
    const formData = Object.fromEntries(entries);

    const name = formData.name as string;
    const start = formData.start as string;
    const end = formData.end as string;
    const street = formData.street as string;
    const num = formData.num as string;
    const zip = formData.zip as string;
    const city = formData.city as string;
    const country = formData.country as string;

    try {
      checkData(name, street, num, zip, city, country);
      await editActivity(
        name,
        start,
        end,
        street,
        parseInt(num),
        zip,
        city,
        country,
        data.id,
        data.idActivity,
        $user!.token
      );
      goto(`${base}/periods/${data.id}`);
    } catch (e: any) {
      message = e.message;
    }
  }
</script>

<svelte:head>
  <title>Editer activité - Unwind</title>
</svelte:head>

{#if message}
  <MessageCard {message} isError />
{/if}
<Title text="Modifier {activity?.name}" />

<form on:submit|preventDefault={handleSubmit} class="py-4">
  <Input
    title="Nom"
    name="name"
    type="text"
    value={activity?.name}
    isRequired
  />
  <Input
    title="Date et heure de début"
    name="start"
    type="datetime-local"
    value={activity?.startDateTime}
  />
  <Input
    title="Date et heure de fin"
    name="end"
    type="datetime-local"
    value={activity?.endDateTime}
  />
  <Input title="Rechercher un lieu" name="address" type="text" />
  <Input title="Rue" name="street" type="text" value={streetInput} isRequired />
  <Input title="Numéro" name="num" type="number" value={numInput} isRequired />
  <Input
    title="Code postal"
    name="zip"
    type="text"
    value={zipInput}
    isRequired
  />
  <Input
    title="Localité"
    name="city"
    type="text"
    value={cityInput}
    isRequired
  />
  <SelectInput
    title="Pays"
    name="country"
    {options}
    value={countryInput}
    isRequired
  />
  <Button text="Sauvegarder" />
</form>
