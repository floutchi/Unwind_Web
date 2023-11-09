<script lang="ts">
  export let icon: string;
  export let title: string;
</script>

<button
  {title}
  class="p-2 rounded-full text-gray-600 border-gray-200 hover:bg-gray-200 material-icons"
  on:click>{icon}</button
>
