<script>
  import { page } from "$app/stores";
  import Title from "$lib/components/Title.svelte";
</script>

<div class="text-center">
  <Title text="Erreur {$page.status}" />
  <p class="py-2 text-lg lg:text-xl">{$page.error?.message}</p>
</div>
