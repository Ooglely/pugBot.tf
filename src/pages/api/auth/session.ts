import type { APIRoute } from "astro";
import { getUser } from "../../../../lib/database";

export const GET: APIRoute = async ({ cookies }) => {
  let sessionID = cookies.get("sessionID");
  if (!sessionID) {
    return new Response(
      JSON.stringify({ status: 401, error: "Unauthorized" }),
      { status: 401 },
    );
  }
  var data;
  await getUser(sessionID.value)
    .then((response) => {
      data = response;
    })
    .catch((err) => {
      return new Response(JSON.stringify({ status: 500, error: err }), {
        status: 500,
      });
    });
  if (!data) {
    return new Response(
      JSON.stringify({ status: 401, error: "Invalid sessionID." }),
      { status: 401 },
    );
  } else {
    return new Response(JSON.stringify(data.userData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
