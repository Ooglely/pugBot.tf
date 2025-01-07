<script>
    import { cubicOut } from "svelte/easing";
    import { tweened } from "svelte/motion";
    import { interpolateRound } from "d3-interpolate";

    const player_count = tweened(0, { duration: 2000, easing: cubicOut, interpolate: interpolateRound });
    const log_count = tweened(0, { duration: 2000, easing: cubicOut, interpolate: interpolateRound });

    getPlayerCounts();

    async function getPlayerCounts() {
        const res = await fetch("https://api.oog.pw/api/stats");
        const stats = await res.json();

        if (res.ok) {
            player_count.set(stats.players);
            log_count.set(stats.logs);
            return stats;
        } else {
            player_count.set(3000);
            log_count.set(7000);
        }
    }

    let innerWidth;
    export let text_size = "2.25vw";
    function handleResize() {
        console.log("test");
        if (innerWidth < 1000) {
            text_size = "3.5vw";
        } else {
            text_size = "2.25vw";
        }
    }
</script>

<h2 class="stats" id="stats" style:font-size={text_size}>
    <span class="text-gradient">{$player_count}</span> registered players - <span class="text-gradient">{$log_count}</span> games recorded
</h2>

<svelte:window on:load={handleResize} on:resize={handleResize} bind:innerWidth />

<style>
    .text-gradient {
        color: var(--accent);
        -webkit-text-stroke: 1px #000000;
    }

    h2.stats {
        margin-top: 20px;
        padding-right: 20px;
        padding-left: 20px;
    }
</style>
