<script>
  import { base } from "$app/paths";
  import NavLink from "./NavLink.svelte";

  let showLinks = false;

  function openLinks() {
    showLinks = true;
  }

  function closeLinks() {
    showLinks = false;
  }
</script>

<nav class="py-10 md:flex md:justify-between md:items-center">
  <div class="flex justify-between items-center">
    <h2
      class="text-lg lg:text-2xl bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent font-semibold"
    >
      Unwind
    </h2>
    <button class="md:hidden material-icons" on:click={openLinks}>menu</button>
  </div>

  <div
    class:hidden={!showLinks}
    class="fixed inset-0 backdrop-blur-sm backdrop-brightness-90"
  />

  <ul
    class:hidden={!showLinks}
    class="fixed md:static flex md:flex flex-col md:flex-row gap-4 md:gap-10 p-10 md:p-0 top-4 right-4 shadow-xl md:shadow-none rounded-lg md:rounded-none bg-white md:bg-transparent"
  >
    <button
      class="fixed top-7 right-7 md:hidden material-icons"
      on:click={closeLinks}>close</button
    >
    <NavLink text="Accueil" url={base} />
    <NavLink text="Contact" url="{base}/contact" />
    <NavLink text="Connexion" url="{base}/auth/sign-in" />
    <li>
      <a
        href="{base}/auth/sign-up"
        class="py-2 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-md hover:from-cyan-600 hover:to-teal-600"
        >S'inscrire</a
      >
    </li>
  </ul>
</nav>
