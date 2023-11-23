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
  import { periods } from "$lib/periods";
  import { checkData, editActivity, type Activity } from "$lib/activities";
  import { onMount } from "svelte";
  import { user } from "$lib/auth";

  export let data: PageData;
  let activity: Activity;

  const options: SelectOption[] = countries.map((c) => {
    return { name: c.name, value: c.code };
  });

  let message = "";

  onMount(() => {
    const unsubscribe = user.subscribe((u) => {
      if (u) {
        const a = periods
          .getPeriod(parseInt(data.id))
          .activities.find((a) => a.idActivity === parseInt(data.idActivity))!;

        if (!a) {
          goto(`${base}/periods/`);
        }

        activity = a;
      }
    });

    return unsubscribe;
  });

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
        data.idActivity
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
  <Input
    title="Rue"
    name="street"
    type="text"
    value={activity?.place.street}
    isRequired
  />
  <Input
    title="Numéro"
    name="num"
    type="number"
    value={activity?.place.num?.toString() || ""}
    isRequired
  />
  <Input
    title="Code postal"
    name="zip"
    type="text"
    value={activity?.place.zipCode}
    isRequired
  />
  <Input
    title="Localité"
    name="city"
    type="text"
    value={activity?.place.city}
    isRequired
  />
  <SelectInput
    title="Pays"
    name="country"
    {options}
    value={activity?.place.country}
    isRequired
  />
  <Button text="Sauvegarder" />
</form>
