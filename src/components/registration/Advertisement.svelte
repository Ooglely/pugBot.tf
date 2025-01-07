<script lang="ts">
    import ServerAd from "./ServerAd.svelte";

    let server_list = {
        "4v4 Passtime": {
            icon: "passtime.png",
            invite: "https://discord.gg/jwua8c5cWp",
            description:
                "4v4 PASS Time is a competitive basketball-like gamemode of TF2 focusing more on fast-paced, skillful gameplay than its casual counterpart. It challenges teams to use their mechanical skills (rocket jumps, airshots, trimps, surfs, etc) as well as solid teamwork and communication. ",
            gamemode: ["Passtime"],
        },
        "TF2 Coaching Central": {
            icon: "tf2cc_logo.png",
            invite: "https://discord.gg/ybSYAd9",
            description: "Learning environment for players new to competitive with educational classes, events and divisional 6s pugs for Newcomer up to Main+!",
            gamemode: ["Sixes"],
        },
    };
    let {
        progression_state,
    }: {
        progression_state: number;
    } = $props();
</script>

<div class="header">
    <h1>Registered</h1>
</div>
{#if progression_state == 3}
    <h3>You have successfully registered your account!</h3>
    <p>Looking for servers to play on? Check out the following servers using pugBot:</p>
    <div class="serverlist">
        {#each Object.keys(server_list) as server}
            <ServerAd name={server} {...server_list[server]} />
        {/each}
    </div>
{/if}

<style>
    .header > h1 {
        text-align: center;
        line-height: 100px;
        margin: 0;
    }

    h3 {
        margin-top: 0px;
        text-align: center;
    }

    p {
        text-align: center;
    }
</style>
