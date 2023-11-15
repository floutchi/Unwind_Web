<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import type { SelectOption } from "$lib/SelectOptionType";
    import Button from "$lib/components/Button.svelte";
    import Input from "$lib/components/Input.svelte";
    import MessageCard from "$lib/components/MessageCard.svelte";
    import SelectInput from "$lib/components/SelectInput.svelte";
    import Title from "$lib/components/Title.svelte";
    import { countries } from "$lib/countries";
    import { checkData, editPeriod, fetchPeriod, type VacationPeriod } from "$lib/periods";
    import { user } from "$lib/auth";
    import Spinner from "$lib/components/Spinner.svelte";

    export let data: PageData;
    let periodPromise: Promise<VacationPeriod>;

    onMount(() => {
        const unsubscribe = user.subscribe((u) => {
            if (u) {
                periodPromise = fetchPeriod(data.id, u.token);
            }
        });

        return unsubscribe;
    });

    const options: SelectOption[] = countries.map((c) => {
        return { name: c.name, value: c.code };
    });

    let message = "";

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
            await editPeriod(
                data.id,
                name,
                start,
                end,
                street,
                parseInt(num),
                zip,
                city,
                country
            );
            await goto(`${base}/periods/${data.id}`);
        } catch (e: any) {
            message = e.message;
        }
    }
</script>

<svelte:head>
    <title>Nouvelles vacances - Unwind</title>
</svelte:head>

{#if message}
    <MessageCard {message} isError />
{/if}

{#if periodPromise}
  {#await periodPromise}
    <Spinner />
  {:then period}
  <Title text="Modifier {period.name}" />

  <form on:submit|preventDefault={handleSubmit} class="py-4">
    <Input title="Nom" name="name" type="text" value="{period.name}" isRequired />
    <Input title="Date de début" name="start" value="{period.startDateTime.split("T")[0]}" type="date" isRequired />
    <Input title="Date de fin" name="end" value="{period.endDateTime.split("T")[0]}" type="date" isRequired />
    <Input title="Rue" name="street" value="{period.place.street}" type="text" isRequired />
    <Input title="Numéro" name="num" value="{String(period.place.num)}" type="number" isRequired />
    <Input title="Code postal" name="zip" value="{period.place.zipCode}" type="text" isRequired />
    <Input title="Localité" name="city" value="{period.place.city}" type="text" isRequired />
    <SelectInput title="Pays" name="country" value="{period.place.country}" {options} isRequired />
    <Button text="Sauvegarder" />
</form>
    
  {:catch}
    {goto(`${base}/periods`)}
  {/await}
{/if}
