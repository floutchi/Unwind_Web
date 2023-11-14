<script lang="ts">
    export let content: string;
    export let dateTime: string;
</script>


<div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
    <p class="text-sm">{content}</p>
</div>
<span class="text-xs text-gray-500 leading-none">{dateTime}</span>