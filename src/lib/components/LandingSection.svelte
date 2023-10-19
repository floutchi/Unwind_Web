<script lang="ts">
  export let title: string;
  export let subtitle: string;
  export let imagePath: string;
  export let imageAlt: string;
</script>

<div
  class="py-20 flex flex-col text-center lg:flex-row lg:justify-between lg:items-center lg:text-left"
>
  <div class="lg:p-10">
    <h3 class="py-2 text-3xl">
      {title}
    </h3>
    <p class="py-2 text-lg lg:text-xl">
      {subtitle}
    </p>
  </div>
  <img class="py-4 lg:max-w-md" src={imagePath} alt={imageAlt} />
</div>
