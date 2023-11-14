<script lang="ts">
  import Title from "$lib/components/Title.svelte";
  import { onDestroy, onMount } from "svelte";
  import { user } from "$lib/auth";
  import { chatMessages, closeConnection, fetchMessages, type Message } from "$lib/messages";
  import type { PageData } from "./$types";
  import Spinner from "$lib/components/Spinner.svelte";
  import MessageList from "$lib/components/MessageList.svelte";
    import { createConnection, sendMessageToServer } from "$lib/messages";

  export let data: PageData;

  let messagesPromise: Promise<Message[]>;

  onMount(() => {

    const unsubscribe = user.subscribe((u) => {
      if (u) {
        createConnection(data.id);

        messagesPromise = fetchMessages(u.token, data.id);
      }
    });
  });

  onDestroy(() => {
    closeConnection();
  });

  function handleMessage(event: any) {
    let message = event.detail.content;
    if(message.trim() === "") return;
    sendMessageToServer(message, data.id);
  }

  const msgStore = chatMessages.subscribe(async (messages) => {
    let oldMessages = messagesPromise ? await messagesPromise : [];
    for (let newMessage of messages) {
    if (!oldMessages.find(oldMessage => JSON.stringify(oldMessage) === JSON.stringify(newMessage))) {
      oldMessages.push(newMessage);
    }

    messagesPromise = Promise.resolve(oldMessages);
  }

  });

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
