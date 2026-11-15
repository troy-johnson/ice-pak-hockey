import { describe, expect, it } from "vitest";
import { managerEmail } from "./access";

const request = (headers: Record<string, string> = {}) =>
  new Request("https://icepakhockey.com/manager", { headers });

describe("managerEmail", () => {
  it("refuses a deployed site that has no Access values", async () => {
    expect(await managerEmail(request(), { teamDomain: "", policyAud: "", dev: false })).toBeNull();
  });

  it("lets the local dev server through when there are no Access values", async () => {
    expect(await managerEmail(request(), { teamDomain: "", policyAud: "", dev: true })).toBe(
      "dev@localhost",
    );
  });

  const config = { teamDomain: "https://icepak.cloudflareaccess.com", policyAud: "aud", dev: true };

  it("refuses a request with no Access token", async () => {
    expect(await managerEmail(request(), config)).toBeNull();
  });

  it("refuses a token that is not a signed Access token", async () => {
    const headers = { "cf-access-jwt-assertion": "not-a-token" };

    expect(await managerEmail(request(headers), config)).toBeNull();
  });
});
