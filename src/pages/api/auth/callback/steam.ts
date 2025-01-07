// http://localhost:3000/api/auth/callback/steam?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.mode=id_res&openid.op_endpoint=https%3A%2F%2Fsteamcommunity.com%2Fopenid%2Flogin&openid.claimed_id=https%3A%2F%2Fsteamcommunity.com%2Fopenid%2Fid%2F76561198171178258&openid.identity=https%3A%2F%2Fsteamcommunity.com%2Fopenid%2Fid%2F76561198171178258&openid.return_to=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fsteam&openid.response_nonce=2024-02-15T15%3A53%3A16Z0Rk%2FpS6BQfsZ%2BKb3bNuShPIJ2I4%3D&openid.assoc_handle=1234567890&openid.signed=signed%2Cop_endpoint%2Cclaimed_id%2Cidentity%2Creturn_to%2Cresponse_nonce%2Cassoc_handle&openid.sig=Skv1NmaAnZCmnCb3D0yPPilBrQE%3D
import type { APIRoute } from "astro";
import axios from "axios";
import { VALID_NONCE, VALID_OPENID_ENDPOINT, STEAM_API_KEY } from "../../../../../lib/consts";
import { createSession } from "../../../../../lib/auth";
import { getUser, updateSession } from "../../../../../lib/database";

function verifyQuery(searchParams: URLSearchParams) {
  // Verify the returned openid query is valid
  if (searchParams.get("openid.ns") != VALID_NONCE) return false;
  if (searchParams.get("openid.op_endpoint") != VALID_OPENID_ENDPOINT) return false;
  if (searchParams.get("openid.claimed_id") != searchParams.get("openid.identity")) return false;
  if (searchParams.get("openid.return_to") != `${import.meta.env.SITE}/api/auth/callback/steam`) return false;
  return true;
}

async function steamVerification(searchParams: URLSearchParams) {
  return await axios
    .post(VALID_OPENID_ENDPOINT, searchParams.toString(), {
      maxRedirects: 0,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then(({ data, status }) => {
      if (status != 200) {
        return false;
      } else {
        if (typeof data != "string") return false;
        const match = data.match(/^ns:(.+)\nis_valid:(.+)\n$/);
        if (!match) return false;
        if (match[1] != VALID_NONCE) return false;
        return match[2] == "true";
      }
    });
}

async function getUserData(id: string) {
  return axios
    .get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${id}`)
    .then(({ data, status }) => {
      if (status != 200) {
        return null;
      } else {
        return data["response"]["players"][0];
      }
    })
    .catch((err) => {
      console.error("err", err);
      return null;
    });
}

export const GET: APIRoute = async ({ cookies, redirect, url }) => {
  let query_status = verifyQuery(url.searchParams);
  if (!query_status) {
    cookies.set("error", "Invalid query during Steam authentication", { path: "/", sameSite: "lax" });
    return redirect(`/register`, 307);
  }

  url.searchParams.set("openid.mode", "check_authentication");
  var validation = steamVerification(url.searchParams);
  if (!validation) {
    cookies.set("error", "Invalid Steam authentication", { path: "/", sameSite: "lax" });
    return redirect(`/register`, 307);
  }

  // Get the steam ID from return link
  let steamID = url.searchParams.get("openid.claimed_id").split("/").pop();

  // Get the steam profile picture and other data
  const user_data = await getUserData(steamID);

  // Make or update the session
  if (!cookies.has("sessionID")) {
    let sessionID = await createSession({
      steam: {
        id: steamID,
        data: user_data,
      },
    });
    cookies.set("sessionID", sessionID, { path: "/", sameSite: "lax" });
  } else {
    // Session already exists, need to update it
    let current_session = cookies.get("sessionID").value;
    let session_data = await getUser(current_session);
    if (!session_data) {
      cookies.set("error", "Invalid sessionID", { path: "/", sameSite: "lax" });
      return redirect(`/register`, 307);
    }
    session_data.userData.steam = {
      id: steamID,
      data: user_data,
    };
    await updateSession(cookies.get("sessionID").value, session_data.userData);
  }
  return redirect(`/register`, 307);
};
