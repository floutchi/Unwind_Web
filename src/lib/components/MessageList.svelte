<script lang="ts">
    import type { Message } from "$lib/messages";
    import { user } from "$lib/auth";
    import { createEventDispatcher } from "svelte";
    import Button from "./Button.svelte";
    import TchatMessage from "./TchatMessage.svelte";

    export let messages: Message[];
    let content = "";

    const dispatch = createEventDispatcher();

    function sendMessage() {
        dispatch('message', {
            content
        })
        content = "";
    }

    function parseDate(date: string): string {
        return new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString();
    }

</script>

<div
    class="flex flex-col items-center justify-center w-[90%] min-h-screen bg-gray-100 text-gray-800 p-10"
>
    <div class="flex flex-col flex-grow h-0 p-4 overflow-auto">
        <div class="flex w-full mt-2 space-x-3 max-w-xs">
            {#each messages as message}
                <TchatMessage
                    name={message.senderFirstName + " " + message.senderLastName}
                    content={message.content}
                    dateTime={parseDate(message.dateTime)}
                    isSender={message.senderEmail === $user?.email}
                />
            {:else}
                <p class="py-2 text-lg">Vous n'avez aucun message.</p>
            {/each}
        </div>
    </div>
    <form class="bg-gray-300 p-4 w-full rounded-md flex items-center gap-4" on:submit|preventDefault={sendMessage}>
        <input
            class="h-10 w-[90%] rounded px-3 text-sm"
            type="text"
            placeholder="Type your message…"
            bind:value={content}
        />
        <Button text="Envoyer" />
    </form>
</div>
