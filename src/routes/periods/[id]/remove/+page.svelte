<script lang="ts">
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import Button from "$lib/components/Button.svelte";
    import IconButton from "$lib/components/IconButton.svelte";
    import MessageCard from "$lib/components/MessageCard.svelte";
    import Title from "$lib/components/Title.svelte";
    import { fetchPeriod, inviteUser, removeUser, type VacationPeriod } from "$lib/periods";
    import { onMount } from "svelte";
    import type { PageData } from "./$types";
    import { user } from "$lib/auth";
    import Spinner from "$lib/components/Spinner.svelte";

    export let data: PageData;
    let users: string[] = [];
    let usersToRemove: string[] = [];
    let message = "";

    let periodPromise: Promise<VacationPeriod>;

    onMount(() => {
        const unsubscribe = user.subscribe(async (u) => {
            if (u) {
                periodPromise = fetchPeriod(data.id, u.token);
                users = await periodPromise.then((p) =>
                    p.participants.map((u) => u.email)
                );
            }
        });

        return unsubscribe;
    });

    function removeUserFromArray(email: string) {
        users = users.filter((u) => u !== email);
        usersToRemove.push(email);
        usersToRemove = usersToRemove;
    }

    function addUserToArray(email: string) {
        usersToRemove = usersToRemove.filter((u) => u !== email);
        users.push(email);
        users = users;
    }

    async function fetchRemove() {
        message = "";
        for (const user of usersToRemove) {
            try {
                await removeUser(user, data.id);
            } catch (e: any) {
                message = e.message;
                return;
            }
        }
        goto(`${base}/periods/${data.id}`);
    }
</script>

<svelte:head>
    <title>Inviter - Unwind</title>
</svelte:head>

<Title text="Supprimer des personnes" />
{#if message !== ""}
    <MessageCard {message} isError />
{/if}
<div class="flex gap-2 w-[75%] overflow-hidden overflow-x-scroll py-2">
    {#each users as user}
        <div class="flex items-center bg-gray-200 rounded-full p-3 my-2">
            <p>{user}</p>
            <IconButton
                icon="close"
                title="Supprimer"
                on:click={() => removeUserFromArray(user)}
            />
        </div>
    {/each}
</div>
<div class="flex gap-2 w-[75%] overflow-hidden overflow-x-scroll py-2">
    {#each usersToRemove as user}
        <div class="flex items-center bg-red-200 rounded-full p-3 my-2">
            <p>{user}</p>
            <IconButton
                icon="close"
                title="Supprimer"
                on:click={() => addUserToArray(user)}
            />
        </div>
    {/each}
</div>
<div class="h-10" />

<Button text="Confirmer" on:click={fetchRemove} />
