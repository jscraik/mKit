/**
 * GitHub OAuth handler for Cloudflare Workers OAuth Provider
 */

import type { AuthRequest, OAuthHelpers } from "@cloudflare/workers-oauth-provider";
import { Hono } from "hono";
import { Octokit } from "octokit";
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
    return redirectToGithub(c.req.raw, oauthReqInfo, c.env.GITHUB_CLIENT_ID);
  }

  return renderApprovalDialog(c.req.raw, {
    client: await c.env.OAUTH_PROVIDER.lookupClient(clientId),
    server: {
      provider: "github",
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
  return redirectToGithub(c.req.raw, oauthReqInfo, c.env.GITHUB_CLIENT_ID, headers);
});

async function redirectToGithub(
  request: Request,
  oauthReqInfo: AuthRequest,
  githubClientId: string | undefined,
  headers: Record<string, string> = {}
) {
  return new Response(null, {
    status: 302,
    headers: {
      ...headers,
      location: getUpstreamAuthorizeUrl({
        upstream_url: "https://github.com/login/oauth/authorize",
        scope: "read:user",
        client_id: githubClientId || "",
        redirect_uri: new URL("/callback/github", request.url).href,
        state: btoa(JSON.stringify(oauthReqInfo)),
      }),
    },
  });
}

app.get("/callback/github", async (c) => {
  const oauthReqInfo = JSON.parse(atob(c.req.query("state") || "")) as AuthRequest;
  if (!oauthReqInfo.clientId) {
    return c.text("Invalid state", 400);
  }

  const [accessToken, errResponse] = await fetchUpstreamAuthToken({
    upstream_url: "https://github.com/login/oauth/access_token",
    client_id: c.env.GITHUB_CLIENT_ID || "",
    client_secret: c.env.GITHUB_CLIENT_SECRET || "",
    code: c.req.query("code"),
    redirect_uri: new URL("/callback/github", c.req.url).href,
  });
  if (errResponse) return errResponse;

  const user = await new Octokit({ auth: accessToken }).rest.users.getAuthenticated();
  const { login, name, email } = user.data;

  const { redirectTo } = await c.env.OAUTH_PROVIDER.completeAuthorization({
    request: oauthReqInfo,
    userId: login,
    metadata: {
      label: name,
    },
    scope: oauthReqInfo.scope,
    props: {
      login,
      name,
      email,
      accessToken,
      userEmail: email,
    } as AuthProps,
  });

  return Response.redirect(redirectTo);
});

export { app as GitHubHandler };
