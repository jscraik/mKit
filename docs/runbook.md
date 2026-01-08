# Operational runbook for the MCP boilerplate

This runbook lists routine operational checks and incident actions.

Last updated: 2026-01-08
Owner: TBD (set on-call/maintainer)
Review cadence: Quarterly (confirm)

## Doc requirements
- Audience tier: Intermediate
- Scope: Operational checks, incident response, and rollback guidance
- Non-scope: Vendor-specific incident response procedures
- Required approvals: On-call or maintainer approval for emergency changes (confirm)

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
- Assumptions: A deployed worker is reachable and logs are accessible.
- Risks / blast radius: Auth or billing failures can block all traffic.
- Rollback / recovery: Redeploy a known-good build and rotate secrets.

## Prerequisites
- Required: Access to Cloudflare dashboard and Wrangler CLI
- Optional: Stripe dashboard access for webhook validation

## Quickstart
### 1) Perform a basic health check
- Confirm the worker URL responds and `/mcp` returns a non-5xx response.

### 2) Verify
Expected output:
- Worker responses are within normal latency and no new errors appear in logs.
- `/mcp` does not return 5xx responses.

## Common tasks
### Investigate authentication failures
- What you get: Confirmation of auth configuration health.
- Steps:
```sh
# Check OAUTH_ISSUER and OAUTH_JWKS_URI values in the environment.
```
- Verify: Tokens validate against JWKS.

### Validate Stripe webhooks
- What you get: Confirmation of billing events.
- Steps:
```sh
# Check STRIPE_WEBHOOK_SECRET and Stripe dashboard event logs.
```
- Verify: Webhooks are acknowledged without signature errors.

### Emergency rollback
- What you get: A known-good deployment.
- Steps:
```sh
# Redeploy the previous known-good commit and rotate secrets if needed.
```
- Verify: Errors stop and expected behavior returns.

## Troubleshooting
### Symptom: Elevated 401/403 rates
Cause: OAuth issuer or JWKS misconfiguration.
Fix: Recheck OAuth configuration and redeploy.

### Symptom: Billing events missing
Cause: Stripe webhook misconfiguration.
Fix: Verify webhook endpoint and signing secret.

### Symptom: Worker errors after deploy
Cause: Configuration drift or missing bindings.
Fix: Compare `wrangler.jsonc` with production settings and redeploy.

## Acceptance criteria
- [ ] Health checks are defined and repeatable.
- [ ] Auth and billing checks are documented.
- [ ] Rollback steps are available.
- [ ] On-call ownership is assigned.

## Evidence bundle
- Lint outputs (Vale/markdownlint/link check): Not run (no configs found).
- Brand check output: Not run (no brand check script found).
- Readability output (if available): Not run (no readability script found).
- Checklist snapshot: Pending maintainer confirmation.

## Reference
- Deployment steps: `docs/deployment.md`
- Configuration: `docs/configuration.md`
- Security policy: `SECURITY.md`
