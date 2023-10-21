<script lang="ts">
  import type { SelectOption } from "$lib/SelectOptionType";
  import { user } from "$lib/auth";
  import Button from "$lib/components/Button.svelte";
  import Input from "$lib/components/Input.svelte";
  import MessageCard from "$lib/components/MessageCard.svelte";
  import SelectInput from "$lib/components/SelectInput.svelte";
  import TextArea from "$lib/components/TextArea.svelte";
  import Title from "$lib/components/Title.svelte";
  import { sendEmail, verifyData } from "$lib/contact";

  const options: SelectOption[] = [
    {
      value: "",
      name: "Sélectionner une raison",
    },
    {
      value: "issue",
      name: "Signaler un problème",
    },
    {
      value: "request",
      name: "Formuler une demande",
    },
  ];

  let message: string | null = null;
  let isError: boolean = false;

  async function handleSubmit(event: SubmitEvent) {
    message = null;
    const entries = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(entries);

    const email = data.email as string;
    const reason = data.reason as string;
    const content = data.content as string;

    try {
      verifyData(email, reason, content);
    } catch (e: any) {
      isError = true;
      message = e.message;
      return;
    }

    const result = await sendEmail(email, reason, content);

    if (result === "OK") {
      isError = false;
      message = "Le message a bien été envoyé";
    } else {
      isError = true;
      message = "Une erreur est survenue lors de l'envoi du message";
    }
  }
</script>

<svelte:head>
  <title>Contact - Unwind</title>
</svelte:head>

<Title text="Contact" />
{#if message}
  <MessageCard {message} {isError} />
{/if}
<form on:submit|preventDefault={handleSubmit} class="py-4">
  <Input
    title="Votre adresse e-mail"
    name="email"
    type="email"
    value={$user?.email}
    isRequired
  />
  <SelectInput title="Raison du message" name="reason" {options} isRequired />
  <TextArea title="Contenu du message" name="content" isRequired />
  <Button text="Envoyer" />
</form>
