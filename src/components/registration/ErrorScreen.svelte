<script lang="ts">
    let {
        error,
    }: {
        error: string;
    } = $props();
</script>

<div class="wrapper">
    <div class="info">
        <h1>Error registering!</h1>
        <h3>{error}</h3>
        <h4><a href="/register">Refresh</a> the page to restart the registration process and try again.</h4>
        <p>Need help with registration? Contact us on our <a href="https://discord.gg/eEr6V5WTxf">Discord</a>!</p>
    </div>
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
        background: rgb(255 0 0 / 0.5);
        z-index: 100;
        cursor: not-allowed;
    }

    .info {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        justify-content: center;
        background: white;
        padding: 20px;
        border-radius: 10px;
        cursor: auto;
    }
</style>
