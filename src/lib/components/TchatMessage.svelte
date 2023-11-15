<script lang="ts">
  export let name: string;
  export let content: string;
  export let dateTime: string;
  export let isSender: boolean;
</script>

{#if isSender}
  <div class="flex w-full mt-2 space-x-3 ml-auto justify-end">
    <div>
      <span class="text-xs text-gray-500 leading-none">{name}</span>
      <div class="bg-teal-500 text-white p-3 rounded-l-lg rounded-br-lg">
        <p class="text-sm">
          {content}
        </p>
      </div>
      <span class="text-xs text-gray-500 leading-none">{dateTime}</span>
    </div>
  </div>
{:else}
  <div class="flex w-full mt-2 space-x-3">
    <div>
      <span class="text-xs text-gray-500 leading-none">{name}</span>
      <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
        <p class="text-sm">{content}</p>
      </div>
      <span class="text-xs text-gray-500 leading-none">{dateTime}</span>
    </div>
  </div>
{/if}
