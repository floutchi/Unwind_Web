<script lang="ts">
  export let title: string;
  export let name: string;
  export let type: string;
  export let value: string = "";
  export let isRequired: boolean = false;
</script>

<div class="py-2">
  <label for={name} class="block py-1">{title}</label>
  <input
    {type}
    {name}
    id={name}
    {value}
    class="p-3 outline-none border-2 border-gray-200 focus:border-teal-500 rounded-md w-full"
    required={isRequired}
  />
</div>
