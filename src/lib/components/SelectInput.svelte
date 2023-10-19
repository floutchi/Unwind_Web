<script lang="ts">
  import type { SelectOption } from "$lib/SelectOptionType";

  export let title: string;
  export let name: string;
  export let options: SelectOption[];
</script>

<div class="py-2">
  <label for={name} class="block py-1">{title}</label>
  <select
    {name}
    id={name}
    class="p-3 outline-none border-2 border-gray-200 focus:border-teal-500 rounded-md w-full"
  >
    {#each options as option}
      <option value={option.value}>{option.name}</option>
    {/each}
  </select>
</div>
