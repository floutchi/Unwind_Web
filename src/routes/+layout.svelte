<script>
  import { loadAuth } from "$lib/auth";
  import Navbar from "$lib/components/Navbar.svelte";
  import { onMount } from "svelte";
  import "../app.css";
  import Footer from "$lib/components/Footer.svelte";

  onMount(async () => await loadAuth());
</script>

<div class="px-10 md:px-20 lg:px-40 min-h-screen bg-white font-lexend">
  <Navbar />
  <slot />
  <Footer />
</div>
