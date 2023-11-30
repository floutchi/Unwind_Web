<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import type { SelectOption } from "$lib/SelectOptionType";
  import Button from "$lib/components/Button.svelte";
  import Input from "$lib/components/Input.svelte";
  import MessageCard from "$lib/components/MessageCard.svelte";
  import SelectInput from "$lib/components/SelectInput.svelte";
  import Title from "$lib/components/Title.svelte";
  import { countries } from "$lib/countries";
  import { checkData, periods } from "$lib/periods";
  import { onMount } from "svelte";
  import { Loader } from "@googlemaps/js-api-loader";

  const options: SelectOption[] = countries.map((c) => {
    return { name: c.name, value: c.code };
  });

  let autocomplete: any;
  let address: any;

  const autoOptions = {
    fields: ["address_components", "geometry", "name"],
    types: ["address"],
    strictBounds: false,
  };

  onMount(() => {
    const loader = new Loader({
      apiKey: "AIzaSyCLNgwKUno1K3gg3MngB-iDS5md5yEVzck",
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .importLibrary("places")
      .then(() => {
        autocomplete = new google.maps.places.Autocomplete(
          document.getElementById("adress"),
          autoOptions,
        );

        autocomplete.addListener("place_changed", onPlaceChanged);
      })
      .catch((e) => {
        console.log(e);
      });
    });

    function onPlaceChanged() {
      address = autocomplete.getPlace();

      console.log(address.address_components);
      const streetInput = document.getElementById("street") as HTMLInputElement | null;
      const numInput = document.getElementById("num") as HTMLInputElement | null;
      const zipInput = document.getElementById("zip") as HTMLInputElement | null;
      const cityInput = document.getElementById("city") as HTMLInputElement | null;
      const countryInput = document.getElementById("country") as HTMLInputElement | null;
      if (streetInput && numInput && zipInput && cityInput && countryInput) {
        streetInput.value =
        address.address_components.find((c: any) => c.types.includes("route"))
        ?.long_name || "";
        numInput.value =
        address.address_components.find((c: any) => c.types.includes("street_number"))
        ?.long_name || "";
        zipInput.value =
        address.address_components.find((c: any) => c.types.includes("postal_code"))
        ?.long_name || "";
        cityInput.value =
        address.address_components.find((c: any) => c.types.includes("locality"))
        ?.long_name || "";
        countryInput.value =
        address.address_components.find((c: any) => c.types.includes("country"))
        ?.short_name || "";
    }
  };

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
  <Input title="Adresse" name="adress" type="text"/>
  <Input title="Rue" name="street" type="text" isRequired />
  <Input title="Numéro" name="num" type="number" isRequired />
  <Input title="Code postal" name="zip" type="text" isRequired />
  <Input title="Localité" name="city" type="text" isRequired />
  <SelectInput title="Pays" name="country" {options} isRequired />
  <Button text="Créer" />
</form>
