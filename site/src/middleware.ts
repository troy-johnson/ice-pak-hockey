import { env } from "cloudflare:workers";
import { defineMiddleware } from "astro:middleware";
import { managerEmail } from "./lib/access";
import { SITE_DATA_TAG, secondsUntilChange } from "./lib/page-cache";

export const onRequest = defineMiddleware(async (context, next) => {
  if (!context.url.pathname.startsWith("/manager")) {
    const moment = new Date();
    const response = await next();
    // Cache each public page that read the Games, so that a repeat request reads nothing from D1.
    if (response.status === 200 && context.locals.games) {
      const games = await context.locals.games;
      context.cache.set({
        maxAge: secondsUntilChange(
          games.map((game) => game.startsAt),
          moment,
        ),
        tags: [SITE_DATA_TAG],
      });
    }
    return response;
  }

  const email = await managerEmail(context.request, {
    teamDomain: env.TEAM_DOMAIN,
    policyAud: env.POLICY_AUD,
    dev: import.meta.env.DEV,
  });
  if (!email) return new Response("Forbidden", { status: 403 });

  context.locals.manager = email;
  const response = await next();
  // A Manager save can change each public page, so remove them from the cache.
  if (context.request.method === "POST") {
    try {
      await context.cache.invalidate({ tags: [SITE_DATA_TAG] });
    } catch (error) {
      console.error("The purge of the public pages failed", error);
    }
  }
  return response;
});
