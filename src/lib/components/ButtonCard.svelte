<script lang="ts">
  export let icon: string;
  export let title: string;
</script>

<button
  {title}
  on:click
  class="flex justify-center items-center shadow-xl rounded-lg p-10 bg-teal-500 material-icons text-white text-4xl"
>
  {icon}
</button>
