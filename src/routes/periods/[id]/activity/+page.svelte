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
  import type { PageData } from "./$types";

  export let data: PageData;
  const options: SelectOption[] = countries.map((c) => {
    return { name: c.name, value: c.code };
  });
  let message = "";

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
  <Input title="Rue" name="street" type="text" isRequired />
  <Input title="Numéro" name="num" type="number" isRequired />
  <Input title="Code postal" name="zip" type="text" isRequired />
  <Input title="Localité" name="city" type="text" isRequired />
  <SelectInput title="Pays" name="country" {options} isRequired />
  <Button text="Ajouter" />
</form>
