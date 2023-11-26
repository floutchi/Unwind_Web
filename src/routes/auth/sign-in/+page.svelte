<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { signIn, user } from "$lib/auth";
  import Button from "$lib/components/Button.svelte";
  import GoogleButton from "$lib/components/GoogleButton.svelte";
  import Input from "$lib/components/Input.svelte";
  import MessageCard from "$lib/components/MessageCard.svelte";
  import Title from "$lib/components/Title.svelte";
  import { onMount } from "svelte";

  let message = "";

  let signInTry = 0;
  let canSignIn = true;

  let globalSignInTime: string = Date.now().toString();

  function signInMessage() {
    message =
      "Vous avez essayé de vous connecter 5 fois avec des identifiants incorrects. Veuillez réessayer dans 1 minute.";
    canSignIn = false;
    localStorage.setItem("SignInTime", (Date.now() + 60000).toString());
    globalSignInTime = (Date.now() + 60000).toString();
    setTimeout(() => {
      signInTry = 0;
      canSignIn = true;
    }, 60000);
  }

  onMount(() => {
    const unsubscribe = user.subscribe((value) => {
      if (value) {
        goto(`${base}/periods`);
      }
    });

    let signInTime = localStorage.getItem("SignInTime");
    if (signInTime) {
      globalSignInTime = signInTime;
      if (Date.now() < parseInt(signInTime)) {
        signInMessage();
      }
    }

    return unsubscribe;
  });

  async function handleSubmit(event: SubmitEvent) {
    message = "";
    const entries = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(entries);

    const email = data.email as string;
    const password = data.password as string;

    try {
      if (canSignIn && Date.now() > parseInt(globalSignInTime)) {
        await signIn(email, password);
      } else {
        signInMessage();
      }
    } catch (e: any) {
      message = e.message;
      if (message == "Email ou mot de passe incorect.") {
        signInTry++;
        if (signInTry == 5) {
          signInMessage();
        }
      }
    }
  }
</script>

<svelte:head>
  <title>Connexion - Unwind</title>
</svelte:head>

{#if message !== ""}
  <MessageCard {message} isError />
{/if}
<form class="p-10 shadow-xl rounded-lg" on:submit|preventDefault={handleSubmit}>
  <Title text="Connexion" />
  <Input title="Adresse e-mail" name="email" type="email" isRequired />
  <Input title="Mot de passe" name="password" type="password" isRequired />
  <Button text="Se connecter" />

  <div class="py-4 border-t-2 border-gray-200">
    <GoogleButton />
  </div>
</form>
