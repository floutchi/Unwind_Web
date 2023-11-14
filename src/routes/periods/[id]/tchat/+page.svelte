<script lang="ts">
  import Title from "$lib/components/Title.svelte";
  import { onMount } from "svelte";
  import { user } from "$lib/auth";
  import { fetchMessages, type Message } from "$lib/messages";
  import type { PageData } from "./$types";
  import Spinner from "$lib/components/Spinner.svelte";
  import MessageList from "$lib/components/MessageList.svelte";
    import { createConnection, sendMessageToServer } from "$lib/messages";

  export let data: PageData;

  let messagesPromise: Promise<Message[]>;

  onMount(() => {

    const unsubscribe = user.subscribe((u) => {
      if (u) {
        createConnection(u.email);

        messagesPromise = fetchMessages(u.token, data.id);
      }
    });
  });

  function handleMessage(event: any) {
    let message = event.detail.content
    sendMessageToServer(message, data.id);
  }

</script>

<svelte:head>
  <title>Tchat - Unwind</title>
</svelte:head>

<Title text="Tchat" />
{#if messagesPromise}
  {#await messagesPromise}
  <div class="w-full py-2 flex justify-center items-center">
    <Spinner />
  </div>
  {:then messages}
    <MessageList {messages} on:message={handleMessage} />
  {:catch error}
    <p class="text-red-500">{error.message}</p>
  {/await}
  
{/if}
