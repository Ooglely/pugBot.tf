import type { APIRoute } from "astro";
import { VALID_NONCE, VALID_ID_SELECT, VALID_OPENID_ENDPOINT } from "../../../../lib/consts";

export const GET: APIRoute = async ({ redirect }) => {
  const openIdParams = new URLSearchParams({
    "openid.mode": "checkid_setup",
    "openid.ns": VALID_NONCE,
    "openid.identity": VALID_ID_SELECT,
    "openid.claimed_id": VALID_ID_SELECT,
    "openid.return_to": `${import.meta.env.SITE}/api/auth/callback/steam`,
  });

  let authURL = `${VALID_OPENID_ENDPOINT}?${openIdParams.toString()}`;
  return redirect(authURL, 307);
};
