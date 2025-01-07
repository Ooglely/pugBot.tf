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
  // site: PUGBOT_SITE_URL,
  site: "http://192.168.1.30:4321",
  vite: {
    resolve: {
      conditions: ["browser"],
    },
  },
  devToolbar: {
    enabled: false,
  },
});
