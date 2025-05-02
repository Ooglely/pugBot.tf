<script lang="ts">
    import { tweened } from "svelte/motion";
    import type { SessionData, UserData } from "../../../lib/auth";
    import { cubicOut } from "svelte/easing";
    import { onMount } from "svelte";
    import Loading from "../Loading.svelte";
    import ErrorScreen from "./ErrorScreen.svelte";
    import SteamHeader from "./SteamHeader.svelte";
    import DiscordHeader from "./DiscordHeader.svelte";
    import Advertisement from "./Advertisement.svelte";
    let {
        user_data,
        auth_error,
    }: { user_data: UserData; auth_error: string | undefined } = $props();

    let progression_state = $state(0);

    async function getSession() {
        if (!user_data) {
            progression_state = 1;
            return;
        }
        if (user_data) {
            if (user_data.hasOwnProperty("steam") && user_data.steam.data) {
                progression_state = 2;
            }
            if (user_data.hasOwnProperty("discord")) {
                progression_state = 3;
            }
        }
    }
    const steam_grow = tweened(1, { duration: 400, easing: cubicOut });
    const discord_grow = tweened(0, { duration: 400, easing: cubicOut });
    const done_grow = tweened(0, { duration: 400, easing: cubicOut });

    $effect(() => {
        if (progression_state == 1) {
            steam_grow.set(1);
            discord_grow.set(0);
            done_grow.set(0);
        } else if (progression_state == 2) {
            steam_grow.set(0);
            discord_grow.set(1);
            done_grow.set(0);
        } else if (progression_state == 3) {
            steam_grow.set(0);
            discord_grow.set(0);
            done_grow.set(1);
        }
    });

    onMount(() => {
        getSession();
    });
</script>

<div class="container">
    {#if progression_state == 0}
        <Loading />
    {/if}
    {#if auth_error}
        <ErrorScreen error={auth_error} />
    {/if}
    <div class="steam" style="flex-grow: {$steam_grow}">
        <SteamHeader user_info={user_data} {progression_state} />
    </div>
    <div class="discord" style="flex-grow: {$discord_grow}">
        <DiscordHeader user_info={user_data} {progression_state} />
    </div>
    <div class="done" style="flex-grow: {$done_grow}">
        <Advertisement {progression_state} />
    </div>
</div>

<style>
    .container {
        display: flex;
        position: relative;
        flex-direction: column;
        align-items: stretch;
        height: 100%;
        width: max(65%, 450px);
        left: max(calc((100% - max(65%, 450px)) / 2), 0px);
        border-radius: 10px 10px 0px 0px;
    }

    .steam {
        background-color: #e8e8e8;
        flex-basis: 100px;
        font-size: 10px;
    }

    .discord {
        background-color: #717fff;
        flex-basis: 100px;
        font-size: 10px;
    }

    .done {
        background-color: #fff1d7;
        flex-basis: 100px;
    }
</style>
