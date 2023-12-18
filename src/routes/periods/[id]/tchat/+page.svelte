<script lang="ts">
  import Title from "$lib/components/Title.svelte";
  import { onMount } from "svelte";
  import { chatMessages, closeConnection, fetchMessages } from "$lib/messages";
  import type { PageData } from "./$types";
  import MessageList from "$lib/components/MessageList.svelte";
  import { createConnection, sendMessageToServer } from "$lib/messages";
  import { getAppState } from "$lib/state";
  import { verifyAuth } from "$lib/verify";

  export let data: PageData;
  let state = getAppState();
  let user = state.userStore.user;

  onMount(() => {
    verifyAuth(state.userStore);

    const unsubscribe = user.subscribe((u) => {
      if (u) {
        createConnection(data.id);
        fetchMessages(data.id, u.token);
      }
    });

    return () => {
      unsubscribe();
      closeConnection();
    };
  });

  function handleMessage(event: any) {
    let message = event.detail.content as string;
    if (message.trim() === "") return;
    sendMessageToServer(message, data.id, $user!.email);
  }
</script>

<svelte:head>
  <title>Tchat - Unwind</title>
</svelte:head>

<Title text="Tchat" />

<MessageList messages={$chatMessages} on:message={handleMessage} />
