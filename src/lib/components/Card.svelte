<script lang="ts">
  import { base } from "$app/paths";

  export let title: string;
  export let subtitle: string;
  export let body: string;
  export let url: string = "";
</script>

<div class="shadow-xl rounded-lg p-10">
  <h3 class="text-3xl py-2">
    {#if url !== ""}
      <a href="{base}{url}" class="hover:text-teal-600 hover:underline"
        >{title}</a
      >
    {:else}
      {title}
    {/if}
  </h3>
  <h5 class="py-2 text-lg">{subtitle}</h5>
  {#if !body.includes("script")}
    <p>{@html body}</p>
  {/if}
</div>
