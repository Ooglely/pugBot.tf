import { defineMiddleware } from "astro/middleware";
import { getUser } from "../lib/database";

export const onRequest = defineMiddleware(async (context, next) => {
  let sessionID = context.cookies.get("sessionID");
  if (sessionID) {
    let user_session = await getUser(sessionID.value);
    if (user_session) {
      context.locals.sessionData = user_session.userData;
    } else {
      context.cookies.delete("sessionID");
    }
  }

  return await next();
});
