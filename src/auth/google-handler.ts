/**
 * Google OAuth handler for Cloudflare Workers OAuth Provider
 */

import type { AuthRequest, OAuthHelpers } from "@cloudflare/workers-oauth-provider";
import { Hono } from "hono";
import type { Env } from "../worker/env.js";
import { AuthProps, fetchUpstreamAuthToken, getUpstreamAuthorizeUrl } from "./oauth.js";
import { clientIdAlreadyApproved, parseRedirectApproval, renderApprovalDialog } from "./workers-oauth-utils.js";

const app = new Hono<{ Bindings: Env & { OAUTH_PROVIDER: OAuthHelpers } }>();

app.get("/authorize", async (c) => {
  const oauthReqInfo = await c.env.OAUTH_PROVIDER.parseAuthRequest(c.req.raw);
  const { clientId } = oauthReqInfo;
  if (!clientId) {
    return c.text("Invalid request", 400);
  }

  const cookieSecret = c.env.COOKIE_ENCRYPTION_KEY;
  if (!cookieSecret) {
    console.error("COOKIE_ENCRYPTION_KEY is not configured");
    return c.text("Server configuration error", 500);
  }

  if (
    await clientIdAlreadyApproved(
      c.req.raw,
      oauthReqInfo.clientId,
      cookieSecret
    )
  ) {
    return redirectToGoogle(c, oauthReqInfo);
  }

  return renderApprovalDialog(c.req.raw, {
    client: await c.env.OAUTH_PROVIDER.lookupClient(clientId),
    server: {
      provider: "google",
      name: "mKit",
      logo: "https://avatars.githubusercontent.com/u/314135?s=200&v=4",
      description:
        "mKit is the official boilerplate for bootstrapping MCP servers on Cloudflare Workers with Stripe integration and Google/GitHub authentication.",
    },
    state: { oauthReqInfo },
  });
});

app.post("/authorize", async (c) => {
  const cookieSecret = c.env.COOKIE_ENCRYPTION_KEY;
  if (!cookieSecret) {
    console.error("COOKIE_ENCRYPTION_KEY is not configured");
    return c.text("Server configuration error", 500);
  }

  const { state, headers } = await parseRedirectApproval(
    c.req.raw,
    cookieSecret
  );
  if (!state || typeof state !== "object" || !("oauthReqInfo" in state)) {
    return c.text("Invalid request", 400);
  }

  const oauthReqInfo = (state as { oauthReqInfo: AuthRequest }).oauthReqInfo;
  return redirectToGoogle(c, oauthReqInfo, headers);
});

async function redirectToGoogle(
  c: { req: { raw: Request }; env: { GOOGLE_CLIENT_ID?: string } },
  oauthReqInfo: AuthRequest,
  headers: Record<string, string> = {}
) {
  return new Response(null, {
    status: 302,
    headers: {
      ...headers,
      location: getUpstreamAuthorizeUrl({
        upstream_url: "https://accounts.google.com/o/oauth2/v2/auth",
        scope: "email profile",
        client_id: c.env.GOOGLE_CLIENT_ID || "",
        redirect_uri: new URL("/callback/google", c.req.raw.url).href,
        state: btoa(JSON.stringify(oauthReqInfo)),
      }),
    },
  });
}

app.get("/callback/google", async (c) => {
  const oauthReqInfo = JSON.parse(atob(c.req.query("state") || "")) as AuthRequest;
  if (!oauthReqInfo.clientId) {
    return c.text("Invalid state", 400);
  }

  const code = c.req.query("code");
  if (!code) {
    return c.text("Missing code", 400);
  }

  const [accessToken, googleErrResponse] = await fetchUpstreamAuthToken({
    upstream_url: "https://accounts.google.com/o/oauth2/token",
    client_id: c.env.GOOGLE_CLIENT_ID || "",
    client_secret: c.env.GOOGLE_CLIENT_SECRET || "",
    code,
    redirect_uri: new URL("/callback/google", c.req.url).href,
    grant_type: "authorization_code",
  });
  if (googleErrResponse) {
    return googleErrResponse;
  }

  const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!userResponse.ok) {
    return c.text(`Failed to fetch user info: ${await userResponse.text()}`, 500);
  }

  const { id, name, email } = (await userResponse.json()) as {
    id: string;
    name: string;
    email: string;
  };

  const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({
    request: oauthReqInfo,
    userId: id,
    metadata: {
      label: name,
    },
    scope: oauthReqInfo.scope,
    props: {
      login: id,
      name,
      email,
      accessToken,
      userEmail: email,
    } as AuthProps,
  });

  return Response.redirect(redirectTo);
});

export { app as GoogleHandler };
