import { createRemoteJWKSet, jwtVerify } from "jose";

export interface AccessConfig {
  teamDomain: string;
  policyAud: string;
  dev: boolean;
}

/**
 * Returns the email of the Manager that Cloudflare Access signed in, or null.
 * The local dev server has no Cloudflare Access in front of it, so it lets each request through.
 */
export async function managerEmail(request: Request, config: AccessConfig): Promise<string | null> {
  if (config.dev) return "dev@localhost";
  if (!config.teamDomain || !config.policyAud) return null;

  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) return null;

  try {
    const keys = createRemoteJWKSet(new URL(`${config.teamDomain}/cdn-cgi/access/certs`));
    const { payload } = await jwtVerify(token, keys, {
      issuer: config.teamDomain,
      audience: config.policyAud,
    });

    return typeof payload.email === "string" ? payload.email : null;
  } catch {
    return null;
  }
}
