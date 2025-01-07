import type { APIRoute } from "astro";
import { createId } from "@paralleldrive/cuid2";
import { addState } from "../../../../lib/database";

export const GET: APIRoute = async ({ redirect }) => {
  // Create temporary state
  let state = createId();
  await addState(state);

  const discordAuthParams = new URLSearchParams({
    client_id: "989250144895655966",
    response_type: "code",
    redirect_uri: `${import.meta.env.SITE}/api/auth/callback/discord`,
    scope: "identify guilds",
    state: state,
  });

  let authURL = `https://discord.com/api/oauth2/authorize?${discordAuthParams.toString()}`;

  return redirect(authURL, 307);
};
