import type { APIRoute } from "astro";
import dns from "node:dns/promises";

export const GET: APIRoute = async ({ params }) => {
  if (!params.server) {
    return new Response("Error", { status: 400 });
  }
  const hostname = params.server.split(":")[0];
  const port = params.server.split(":")[1] || "27015";
  const ip = await dns
    .resolve4(hostname)
    .then((result) => {
      return result[0];
    })
    .catch((e) => {
      return null;
    });
  if (!ip) {
    return new Response("Error", { status: 400 });
  } else {
    return new Response(`${ip}:${port}`, { status: 200 });
  }
};
