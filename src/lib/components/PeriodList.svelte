<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
  import type { SelectOption } from "$lib/SelectOptionType";
  import type { VacationPeriod } from "$lib/periods";
  import Button from "./Button.svelte";
    import ButtonCard from "./ButtonCard.svelte";
  import Card from "./Card.svelte";
  import SelectInput from "./SelectInput.svelte";

  export let periods: VacationPeriod[];

  let hidedPeriods: VacationPeriod[] = periods;

  let countries = periods.map((period) => period.place.country);

  let selectOptions: SelectOption[] = countries.map((country) => ({
    value: country,
    label: country,
    name: country,
  }));
  selectOptions.push({ value: "Tous", label: "Tous", name: "Tous" } as SelectOption);

  function filter() {
    let country = (document.querySelector(
      "select[name=country]"
    ) as HTMLSelectElement).value;
    if (country === "Tous") {
      periods = hidedPeriods;
    } else {
      periods = hidedPeriods;
      periods = periods.filter((period) => period.place.country === country);
    }
  }

  function parseDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
</script>

{#if periods.length > 0}
<div class="flex items-center">
  <div class="mr-4">
    <SelectInput title="Filtrer par pays" name="country" options={selectOptions}/>
  </div>
  <div class="mt-7">
    <Button text="Filtrer" on:click={filter} />
  </div>
</div>
{/if}
<div class="flex flex-col gap-6 md:grid md:grid-cols-3 md:gap-4">
  {#each periods as period (period.idHoliday)}
    <Card
      title={period.name}
      subtitle={`${period.place.street} ${period.place.num}, ${period.place.city}`}
      url="/periods/{period.idHoliday}"
    >
      <p>
        Du {parseDate(period.startDateTime)} au {parseDate(
          period.endDateTime
        )}<br />{period.participants.length} participant(s)
      </p>
    </Card>
  {:else}
    <p class="py-2 text-lg">
      Vous n'avez aucune période de vacances. Appuyez sur le bouton "+" pour en
      créer une.
    </p>
  {/each}
  <ButtonCard
    title="Ajouter des vacances"
    icon="add"
    on:click={() => goto(`${base}/periods/new`)}
    />
</div>
