<script>
  import { signInWithGoogle } from "$lib/auth";
  import { onMount } from "svelte";

  onMount(() => {
    google.accounts.id.initialize({
      client_id:
        "611874849050-6o0j87juqjr2acfrjm96pj6j00k1msvg.apps.googleusercontent.com",
      callback: signInWithGoogle,
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" } // customization attributes
    );
  });
</script>

<div id="buttonDiv" />
