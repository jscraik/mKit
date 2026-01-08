# Architecture overview for the MCP boilerplate

This doc explains how the worker, auth, billing, and UI layers fit together.

Last updated: 2026-01-08
Owner: TBD (set maintainer/team)
Review cadence: Quarterly (confirm)

## Doc requirements
- Audience tier: Intermediate
- Scope: High-level architecture and component boundaries
- Non-scope: Detailed vendor configuration steps
- Required approvals: Maintainer approval for architectural changes (confirm)

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
- Assumptions: Cloudflare Workers, Durable Objects, and KV are available.
- Risks / blast radius: Auth or billing bugs can block all requests.
- Rollback / recovery: Redeploy a previous build and rotate secrets.

## Prerequisites
- Required: Familiarity with TypeScript and Cloudflare Workers
- Optional: Stripe and OAuth provider knowledge

## Quickstart
### 1) Locate the main entry points
- Worker entry: `src/worker/index.ts`
- MCP server: `src/worker/mcp.ts`
- Routes: `src/worker/routes.ts`

### 2) Verify
Expected output:
- You can trace requests from `index.ts` to route handlers and tools.

## Common tasks
### Add a new MCP tool
- What you get: A new tool registered with the MCP server.
- Steps:
```sh
# Add a file under src/tools/free/ or src/tools/paid/ and register it in src/tools/index.ts
```
- Verify: The tool is present in the server registration logs.

### Add an authentication provider
- What you get: A new OAuth provider flow.
- Steps:
```sh
# Add a provider under src/auth/ and wire it into routing in src/worker/routes.ts
```
- Verify: The new auth route is reachable and returns expected redirects.

### Add a billing feature
- What you get: A new paid tool or entitlement check.
- Steps:
```sh
# Update src/billing/stripe.ts and paid tool registration in src/tools/paid/
```
- Verify: Stripe checkout can be initiated in a test environment.

## Troubleshooting
### Symptom: Routes are not reachable
Cause: Route not registered in `src/worker/routes.ts`.
Fix: Add the route and ensure it is included in the router.

### Symptom: Tools are missing
Cause: Tool file not imported in `src/tools/index.ts`.
Fix: Register the tool in the appropriate index module.

### Symptom: UI widgets do not appear
Cause: Missing route file under `src/app/routes/`.
Fix: Add the route HTML file and rebuild.

## Acceptance criteria
- [ ] Key entry points are documented.
- [ ] Component boundaries are clear.
- [ ] Tool, auth, billing, and UI layers are described.
- [ ] Troubleshooting covers top failure modes.

## Evidence bundle
- Lint outputs (Vale/markdownlint/link check): Not run (no configs found).
- Brand check output: Not run (no brand check script found).
- Readability output (if available): Not run (no readability script found).
- Checklist snapshot: Pending maintainer confirmation.

## Reference
- Worker entry: `src/worker/index.ts`
- Auth providers: `src/auth/`
- Billing: `src/billing/`
- UI app: `src/app/`
