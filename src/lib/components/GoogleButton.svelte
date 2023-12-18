<script>
  import { getAppState } from "$lib/state";
  import { onMount } from "svelte";

  let auth = getAppState().userStore;

  onMount(() => {
    google.accounts.id.initialize({
      client_id:
        "611874849050-6o0j87juqjr2acfrjm96pj6j00k1msvg.apps.googleusercontent.com",
      callback: auth.signInWithGoogle,
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", shape: "pill", size: "large", text: "signup_with" } // customization attributes
    );
  });
</script>

<div id="buttonDiv" />
