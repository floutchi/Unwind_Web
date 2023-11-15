<script lang="ts">
  export let title: string;
  export let subtitle: string;
  export let content: string;
</script>

<li class="border border-gray-200 p-3 rounded-md">
  <h5 class="text-lg font-semibold">{title}</h5>
  <h6>{subtitle}</h6>
  <p class="py-2">{content}</p>
</li>
