<script>
  import { base } from "$app/paths";
  import { getAppState } from "$lib/state";
  import NavLink from "./NavLink.svelte";

  let showLinks = false;
  let user = getAppState().userStore.user;

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
    class="fixed md:static flex md:flex flex-col md:flex-row md:items-center gap-4 md:gap-10 p-10 md:p-0 top-4 right-4 shadow-xl md:shadow-none rounded-lg md:rounded-none bg-white md:bg-transparent"
  >
    <button
      class="fixed top-7 right-7 md:hidden material-icons"
      on:click={closeLinks}>close</button
    >
    {#if !$user}
      <NavLink text="Accueil" url={base} />
    {/if}
    {#if $user}
      <NavLink on:click={closeLinks} text="Mes vacances" url="{base}/periods" />
      <NavLink
        on:click={closeLinks}
        text="Mon compte"
        url="{base}/auth/account"
      />
    {/if}
    <NavLink on:click={closeLinks} text="Contact" url="{base}/contact" />
    {#if !$user}
      <NavLink
        on:click={closeLinks}
        text="Connexion"
        url="{base}/auth/sign-in"
      />
      <li>
        <a
          on:click={closeLinks}
          href="{base}/auth/sign-up"
          class="py-2 px-4 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-md hover:from-cyan-600 hover:to-teal-600"
          >S'inscrire</a
        >
      </li>
    {/if}
  </ul>
</nav>
