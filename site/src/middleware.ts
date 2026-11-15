import { env } from "cloudflare:workers";
import { defineMiddleware } from "astro:middleware";
import { managerEmail } from "./lib/access";

export const onRequest = defineMiddleware(async (context, next) => {
  if (!context.url.pathname.startsWith("/manager")) return next();

  const email = await managerEmail(context.request, {
    teamDomain: env.TEAM_DOMAIN,
    policyAud: env.POLICY_AUD,
    dev: import.meta.env.DEV,
  });
  if (!email) return new Response("Forbidden", { status: 403 });

  context.locals.manager = email;
  return next();
});
