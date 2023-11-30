<script lang="ts">
  export let message: string;
  export let isError: boolean;
</script>

<p
  class="{isError
    ? 'bg-red-500'
    : 'bg-teal-500'} my-2 text-white p-3 rounded-lg"
    id="message-card"
>
  {message}
</p>
