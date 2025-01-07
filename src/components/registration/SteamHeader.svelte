<script lang="ts">
    import type { UserData } from "../../../lib/auth";
    import { fade } from "svelte/transition";

    let {
        user_info,
        progression_state,
    }: {
        user_info: UserData;
        progression_state: number;
    } = $props();

    let steam_loaded = $derived.by(() => {
        if (user_info) {
            if ("steam" in user_info) {
                return true;
            }
        }
        return false;
    });
</script>

<div class="header">
    <div class="desc">
        <h1>Steam</h1>
    </div>
    <div class="pfp">
        {#if steam_loaded}
            <img src={user_info.steam.data.avatarmedium} alt="Steam Avatar" />
        {:else}
            <img src="/steamdefault.jpg" alt="Not linked" />
        {/if}
    </div>
    <div class="info">
        {#if steam_loaded}
            <h2>{user_info.steam.data.personaname}</h2>
            <p>ID: {user_info.steam.data.steamid}</p>
        {:else}
            <h1>Not linked</h1>
            <p>ID: None</p>
        {/if}
    </div>
</div>
{#if progression_state == 1}
    <div class="login" transition:fade>
        <p>The bot needs to know your Steam account in order to track your stats and logs in PUGs that you play in.</p>
        <p>The authentification is only used to prove ownership and basic account info like account name and ID.</p>
        <p>Click the login button below to authenticate your account.</p>
        <a href="/api/auth/steam" style="width: 109px;height:66px">
            <img src="https://community.fastly.steamstatic.com/public/images/signinthroughsteam/sits_02.png" alt="Steam Login" width="109px" height="66px" />
        </a>
    </div>
{/if}

<style>
    .header {
        display: flex;
        flex-direction: row;
        padding: 10px 0px;
        font-family: Ubuntu;
        font-size: 1rem;
        font-weight: 500;
        height: 80px;
        border-top: 10px;
        border-color: black;
    }

    .header img {
        width: 80px;
        height: 80px;
    }

    .desc {
        display: flex;
        padding-right: 1rem;
        flex-grow: 1;
        justify-content: flex-end;
        align-items: center;
        text-align: right;
        border-right: 2px solid black;
        margin-right: 8px;
    }

    .info {
        display: flex;
        padding-left: 1rem;
        flex-basis: calc(50% - 40px);
        flex-grow: 0;
        text-align: left;
        flex-direction: column;
        justify-content: space-evenly;
    }

    .login {
        background-color: #fff;
        height: calc(100% - 130px);
        width: 85%;
        max-width: min(85%, 1000px);
        min-height: 275px;
        position: relative;
        left: calc((100% - min(85%, 1000px)) / 2);
        margin: 10px 0px 20px 0px;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-evenly;
    }

    .login p {
        text-align: center;
        font-style: normal;
        font-size: 225%;
        flex-grow: 0;
        white-space: normal;
        padding: 0px 10px;
    }

    .login img {
        width: 109px;
        height: 66px;
        object-fit: cover;
    }

    .login a {
        justify-content: center;
        align-items: center;
        margin-bottom: 10px;
        min-height: 66px;
        block-size: fit-content;
    }

    h1 {
        margin: 0;
    }

    h2 {
        margin: 0;
    }

    p {
        margin: 0;
        font-style: italic;
    }
</style>
