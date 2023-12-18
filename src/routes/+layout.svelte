<script>
  import Navbar from "$lib/components/Navbar.svelte";
  import { onMount } from "svelte";
  import "../app.css";
  import Footer from "$lib/components/Footer.svelte";
  import { createAppState } from "$lib/state";

  let state = createAppState();

  onMount(async () => await state.userStore.loadAuth());
</script>

<div class="px-10 md:px-20 lg:px-40 min-h-screen bg-white font-lexend">
  <Navbar />
  <slot />
  <Footer />
</div>
