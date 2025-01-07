<script lang="ts">
    import { fade } from "svelte/transition";
</script>

<div class="wrapper" transition:fade>
    <h1>Loading data...</h1>
</div>

<style>
    .wrapper {
        display: flex;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        color: black;
        background: rgb(255 255 255 / 0.8);
    }
</style>
