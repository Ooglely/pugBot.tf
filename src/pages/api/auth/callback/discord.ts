import type { APIRoute } from "astro";
import { isCuid } from "@paralleldrive/cuid2";
import { checkState, getUser, updateSession } from "../../../../../lib/database";
import axios from "axios";
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, PUGBOT_API_KEY } from "../../../../../lib/consts";
import type { UserData } from "../../../../../lib/auth";

async function getAccessToken(code: string) {
  return axios
    .post(
      "https://discord.com/api/oauth2/token",
      {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: `${import.meta.env.SITE}/api/auth/callback/discord`,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: DISCORD_CLIENT_ID,
          password: DISCORD_CLIENT_SECRET,
        },
      },
    )
    .then(({ data, status }) => {
      if (status != 200) {
        return null;
      } else {
        return data["access_token"];
      }
    })
    .catch((err) => {
      console.error("err", err);
      return null;
    });
}

async function getUserData(accessToken: string) {
  return axios
    .get(`https://discord.com/api/users/@me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    })
    .then(({ data, status }) => {
      if (status != 200) {
        return null;
      } else {
        return data;
      }
    })
    .catch((err) => {
      console.error("err", err);
      return null;
    });
}

async function registerInBot(user_data: UserData) {
  return axios
    .post(
      "https://agg-bot-test.up.railway.app/api/register",
      {
        steam: user_data.steam?.id,
        discord: user_data.discord?.id,
      },
      {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          password: PUGBOT_API_KEY,
        },
      },
    )
    .then(({ status }) => {
      return;
    })
    .catch((err) => {
      console.error("err", err);
      if (err.response.status == 500) {
        throw new Error("Internal pugBot error. Please report to devs in the support server below.");
      } else {
        throw new Error(err.response.data.error);
      }
    });
}

export const GET: APIRoute = async ({ cookies, url, redirect }) => {
  // Check if cuid is valid
  if (!isCuid(url.searchParams.get("state"))) {
    cookies.set("error", "State is not a valid cuid.", { path: "/", sameSite: "lax" });
    return redirect(`${import.meta.env.SITE}/register`, 307);
  }
  // Check if user denied access
  if (url.searchParams.get("error")) {
    cookies.set("error", "User denied access to Discord.", { path: "/", sameSite: "lax" });
    return redirect(`${import.meta.env.SITE}/register`, 307);
  }
  // Check if state matches a generated state
  if (!(await checkState(url.searchParams.get("state")))) {
    cookies.set("error", "State does not match any generated states.", { path: "/", sameSite: "lax" });
    return redirect(`${import.meta.env.SITE}/register`, 307);
  }

  // Get the user data
  let token = await getAccessToken(url.searchParams.get("code"));
  if (!token) {
    cookies.set("error", "Failed to get access token.", { path: "/", sameSite: "lax" });
    return redirect(`${import.meta.env.SITE}/register`, 307);
  }
  let user_data = await getUserData(token);
  console.log(user_data);
  if (!user_data) {
    cookies.set("error", "Failed to get user data.", { path: "/", sameSite: "lax" });
    return redirect(`${import.meta.env.SITE}/register`, 307);
  }

  // Make or update the session
  if (!cookies.has("sessionID")) {
    // The session should already exist if the user went through Steam auth already
    cookies.set("error", "Session not initialized with Steam data. Please try reregistering.", { path: "/", sameSite: "lax" });
    return redirect(`${import.meta.env.SITE}/register`, 307);
  } else {
    // Session already exists, need to update it
    let current_session = cookies.get("sessionID").value;
    let session_data = await getUser(current_session);

    session_data.userData.discord = {
      id: user_data.id,
      data: user_data,
    };

    // Attempt pugBot registration
    try {
      await registerInBot(session_data.userData);
    } catch (err) {
      console.log("error", err.message);
      cookies.set("error", err.message, { path: "/", sameSite: "lax" });
      return redirect(`${import.meta.env.SITE}/register`, 307);
    }

    await updateSession(cookies.get("sessionID").value, session_data.userData);
  }

  return redirect(`${import.meta.env.SITE}/register`, 307);
};
