# Configuration reference for the MCP boilerplate

This doc lists environment variables and Cloudflare bindings used by the template.

Last updated: 2026-01-08
Owner: TBD (set maintainer/team)
Review cadence: Quarterly (confirm)

## Doc requirements
- Audience tier: Intermediate
- Scope: Runtime configuration, env vars, and bindings
- Non-scope: Vendor-specific account setup details
- Required approvals: Maintainer approval for config changes (confirm)

## Table of contents
- [Doc requirements](#doc-requirements)
- [Risks and assumptions](#risks-and-assumptions)
- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Common tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Acceptance criteria](#acceptance-criteria)
- [Evidence bundle](#evidence-bundle)
- [Reference](#reference)

## Risks and assumptions
- Assumptions: `.env` is local-only and never committed.
- Risks / blast radius: Leaked secrets or incorrect base URLs.
- Rollback / recovery: Rotate secrets and redeploy.

## Prerequisites
- Required: Access to OAuth and Stripe credentials
- Optional: Separate dev and prod environment values

## Quickstart
### 1) Create your local env file
```sh
cp .env.example .env
```

### 2) Verify
Expected output:
- `.env` exists locally and is not committed.

## Common tasks
### Configure base URLs
- What you get: Correct origin values for OAuth and widgets.
- Steps:
```sh
# Update BASE_URL and WIDGET_DOMAIN in .env
```
- Verify: OAuth and widget URLs resolve correctly.

### Configure OAuth providers
- What you get: Working sign-in flows.
- Steps:
```sh
# Update OAUTH_ISSUER, OAUTH_JWKS_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
# GITHUB_CLIENT_ID, and GITHUB_CLIENT_SECRET in .env
```
- Verify: OAuth login succeeds in test mode.

### Configure Stripe billing
- What you get: Checkout and webhooks for paid tools.
- Steps:
```sh
# Update STRIPE_* variables in .env
```
- Verify: Stripe test checkout completes and webhooks validate.

## Troubleshooting
### Symptom: Worker fails at startup due to missing env vars
Cause: `.env` is missing required keys.
Fix: Recreate `.env` from `.env.example` and fill values.

### Symptom: OAuth tokens fail validation
Cause: `OAUTH_ISSUER` or `OAUTH_JWKS_URI` is incorrect.
Fix: Confirm issuer and JWKS URL match your auth provider.

### Symptom: Payments fail or webhooks reject
Cause: Stripe keys are invalid or mismatched.
Fix: Rotate Stripe keys and update `.env`.

## Acceptance criteria
- [ ] `.env` is present and not committed.
- [ ] All required keys from `.env.example` are set.
- [ ] KV namespace IDs are configured in `wrangler.jsonc`.
- [ ] OAuth and Stripe values are validated in test mode.

## Evidence bundle
- Lint outputs (Vale/markdownlint/link check): Not run (no configs found).
- Brand check output: Not run (no brand check script found).
- Readability output (if available): Not run (no readability script found).
- Checklist snapshot: Pending maintainer confirmation.

## Reference
- Environment template: `.env.example`
- Wrangler bindings: `wrangler.jsonc`
- Cloudflare bindings schema: `package.json` (`cloudflare.bindings`)

## Environment variables
| Variable | Required | Description | Example |
|---|---:|---|---|
| `BASE_URL` | Yes | Base URL of the deployed worker. | `https://your-worker.workers.dev` |
| `WIDGET_DOMAIN` | Yes | Widget domain for Apps SDK sandbox. | `https://your-widget-domain.com` |
| `OAUTH_ISSUER` | Yes | OAuth 2.1 authorization server issuer URL. | `https://auth.example.com` |
| `OAUTH_JWKS_URI` | Yes | JWKS URI for token verification. | `https://auth.example.com/.well-known/jwks.json` |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID. | `your-client-id.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret. | `your-google-client-secret` |
| `GITHUB_CLIENT_ID` | Yes | GitHub OAuth client ID. | `your-github-client-id` |
| `GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth client secret. | `your-github-client-secret` |
| `COOKIE_ENCRYPTION_KEY` | Yes | 32-byte hex key for cookie encryption. | `your-32-byte-hex-key` |
| `STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key. | `pk_test_...` |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key. | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret. | `whsec_...` |
| `STRIPE_SUBSCRIPTION_PRICE_ID` | Yes | Stripe subscription price ID. | `price_...` |
| `STRIPE_ONETIME_PRICE_ID` | Yes | Stripe one-time price ID. | `price_...` |
| `STRIPE_METERED_PRICE_ID` | Yes | Stripe metered price ID. | `price_...` |

## Cloudflare bindings
| Binding | Type | Description |
|---|---|---|
| `OAUTH_KV` | KV namespace | Stores OAuth state and metadata. |
| `MCP_OBJECT` | Durable Object | Main MCP coordination object. |
| `ASSETS` | Asset binding | Static UI assets in `dist/client`. |
