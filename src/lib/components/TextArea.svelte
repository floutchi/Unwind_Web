<script lang="ts">
  export let title: string;
  export let name: string;
</script>

<div class="py-2">
  <label for={name} class="block py-1">{title}</label>
  <textarea
    {name}
    id={name}
    class="p-3 outline-none border-2 border-gray-200 focus:border-teal-500 rounded-md w-full resize-y"
  />
</div>
