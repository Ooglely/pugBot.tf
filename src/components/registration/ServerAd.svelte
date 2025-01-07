<script lang="ts">
    let {
        name,
        icon,
        invite,
        description,
        gamemode,
    }: {
        name: string;
        icon: string;
        invite: string;
        description: string;
        gamemode: string[];
    } = $props();
</script>

<div class="server">
    <div class="title">
        <img src={icon} alt={name} />
        <h1>{name}</h1>
        <a href={invite}>
            <h2>Join</h2>
        </a>
    </div>
    <div class="description">
        <p class="bold">Gamemode: {gamemode.join(", ")}</p>
        <p>{description}</p>
    </div>
</div>

<style>
    .server {
        display: flex;
        flex-direction: column;
        font-family: Ubuntu;
        border: 1px solid black;
        border-radius: 10px;
        margin: 10px;
    }

    .title {
        height: 50px;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        background: #e8e8e8;
        border-radius: 10px;
        border-top: 1px solid black;
    }

    .title > img {
        width: 50px;
        height: 50px;
        border-radius: 10px 0px 0px 0px;
        flex-grow: 0;
    }

    .title > h1 {
        margin: 10px;
        font-size: 180%;
        flex-grow: 1;
    }

    .title > a {
        background: #33b249;
        margin-left: auto;
        flex-grow: 0;
        border-radius: 0px 10px 0px 0px;
        height: 100%;
        padding: 0px 10px;
        text-decoration: none;
        color: #fff;
    }

    .title > a > h2 {
        margin: 0;
        line-height: 50px;
    }

    p.bold {
        margin-top: 0px;
        font-weight: bold;
    }

    p {
        margin: 2px;
    }

    .description {
        padding: 10px;
    }
</style>
