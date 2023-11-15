<script lang="ts">
  import Title from "$lib/components/Title.svelte";
  import { onMount } from "svelte";
  import { user } from "$lib/auth";
  import { chatMessages, closeConnection, fetchMessages } from "$lib/messages";
  import type { PageData } from "./$types";
  import MessageList from "$lib/components/MessageList.svelte";
  import { createConnection, sendMessageToServer } from "$lib/messages";

  export let data: PageData;

  onMount(() => {
    const unsubscribe = user.subscribe((u) => {
      if (u) {
        createConnection(data.id);
        fetchMessages(u.token, data.id).then(() => console.log("Fetched!"));
      }
    });

    return () => {
      unsubscribe();
      closeConnection();
    };
  });

  function handleMessage(event: any) {
    let message = event.detail.content;
    if (message.trim() === "") return;
    sendMessageToServer(message, data.id);
  }
</script>

<svelte:head>
  <title>Tchat - Unwind</title>
</svelte:head>

<Title text="Tchat" />

<MessageList messages={$chatMessages} on:message={handleMessage} />
