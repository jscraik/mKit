# Deployment steps for the MCP boilerplate

This doc explains how to build and deploy the worker to Cloudflare.

Last updated: 2026-01-08
Owner: TBD (set maintainer/team)
Review cadence: Quarterly (confirm)

## Doc requirements
- Audience tier: Intermediate
- Scope: Build and deploy commands, required config, and verification
- Non-scope: Cloudflare account creation and billing management
- Required approvals: Maintainer approval for production deploys (confirm)

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
- Assumptions: `wrangler.jsonc` contains valid bindings and KV IDs.
- Risks / blast radius: Invalid bindings can break auth or billing.
- Rollback / recovery: Redeploy a known-good version and rotate secrets.

## Prerequisites
- Required: Cloudflare account, Wrangler CLI, valid `.env` values
- Optional: Test Stripe keys and OAuth provider credentials

## Quickstart
### 1) Build the project
```sh
pnpm build
```

### 2) Deploy to Cloudflare
```sh
pnpm deploy
```

### 3) Verify
Expected output:
- Wrangler reports a successful deploy.
- The worker URL responds to `/mcp` requests.

## Common tasks
### Deploy in one step
- What you get: Build + deploy in a single command.
- Steps:
```sh
pnpm build-deploy
```
- Verify: Build and deploy both succeed.

### Dry-run deploy checks
- What you get: A deployment validation without publishing.
- Steps:
```sh
pnpm check
```
- Verify: The dry run exits with status 0.

### Update KV namespaces
- What you get: Valid KV binding IDs for auth state.
- Steps:
```sh
pnpm wrangler kv namespace create OAUTH_KV
pnpm wrangler kv namespace create OAUTH_KV --preview
```
- Verify: IDs are copied into `wrangler.jsonc`.

## Troubleshooting
### Symptom: Deploy fails with missing bindings
Cause: KV or Durable Object bindings are incorrect.
Fix: Update `wrangler.jsonc` with correct IDs.

### Symptom: Worker starts but assets are missing
Cause: `dist/client` assets were not built.
Fix: Run `pnpm build` before deploy.

### Symptom: Auth fails in production
Cause: Production `.env` values differ from local test values.
Fix: Verify secrets and URLs in Cloudflare environment settings.

## Acceptance criteria
- [ ] Build completes without errors.
- [ ] Deploy succeeds and returns a worker URL.
- [ ] `/mcp` responds with expected behavior.
- [ ] KV namespaces are configured for preview and production.

## Evidence bundle
- Lint outputs (Vale/markdownlint/link check): Not run (no configs found).
- Brand check output: Not run (no brand check script found).
- Readability output (if available): Not run (no readability script found).
- Checklist snapshot: Pending maintainer confirmation.

## Reference
- Worker config: `wrangler.jsonc`
- Build scripts: `package.json`
- Environment variables: `docs/configuration.md`
