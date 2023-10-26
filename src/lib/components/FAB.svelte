<script lang="ts">
  export let icon: string;
  export let title: string;
</script>

<button
  {title}
  class="fixed bottom-8 right-8 p-3 bg-teal-500 text-white shadow-xl rounded-xl material-icons"
  on:click
>
  {icon}
</button>
