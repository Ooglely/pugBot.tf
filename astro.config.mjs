import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import node from "@astrojs/node";
import { PUGBOT_SITE_URL } from "./lib/consts";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte({ extensions: [".svelte"] })],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  site: PUGBOT_SITE_URL,
  vite: {
    resolve: {
      conditions: ["browser"],
    },
  },
  devToolbar: {
    enabled: false,
  },
  redirects: {
    "/invite": "https://discord.com/api/oauth2/authorize?client_id=989250144895655966&permissions=1376554085456&scope=bot",
  },
});
