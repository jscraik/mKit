# Local development workflow for the MCP boilerplate

This doc explains how to run the worker and UI locally.

Last updated: 2026-01-08
Owner: TBD (set maintainer/team)
Review cadence: Quarterly (confirm)

## Doc requirements
- Audience tier: Beginner to intermediate
- Scope: Local development setup, scripts, and verification
- Non-scope: Production deployment and vendor setup
- Required approvals: Maintainer approval for workflow changes (confirm)

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
- Assumptions: `.env` contains valid placeholder values.
- Risks / blast radius: Running with real secrets locally can expose credentials.
- Rollback / recovery: Recreate `.env` and rotate any leaked secrets.

## Prerequisites
- Required: Node.js 20+, pnpm, Wrangler CLI
- Optional: Stripe and OAuth test credentials

## Quickstart
### 1) Install dependencies
```sh
pnpm install
```

### 2) Configure environment
```sh
cp .env.example .env
```
Update values in `.env` before running services.

### 3) Run the UI and worker
```sh
pnpm dev
pnpm dev:worker
```
Run each command in a separate terminal.

### 4) Verify
Expected output:
- Vite prints a local dev server URL.
- Wrangler prints a local worker URL.

## Common tasks
### Run unit tests
- What you get: Feedback from `vitest`.
- Steps:
```sh
pnpm test
```
- Verify: Tests pass without failures.

### Run lint and type checks
- What you get: Static checks for style and types.
- Steps:
```sh
pnpm lint
pnpm typecheck
```
- Verify: Both commands exit with status 0.

### Generate Cloudflare types
- What you get: Updated Worker bindings typings.
- Steps:
```sh
pnpm cf-typegen
```
- Verify: Type generation finishes without errors.

## Troubleshooting
### Symptom: Vite starts but the worker does not respond
Cause: `pnpm dev:worker` is not running.
Fix: Start the worker in a separate terminal.

### Symptom: Missing environment variables
Cause: `.env` was not created or is incomplete.
Fix: Recreate `.env` from `.env.example` and fill required values.

### Symptom: Type errors when running `pnpm typecheck`
Cause: New code is not aligned with type definitions.
Fix: Update types or adjust implementation.

## Acceptance criteria
- [ ] Local dev uses `.env` derived from `.env.example`.
- [ ] UI and worker run concurrently without errors.
- [ ] Tests and lint checks pass before changes are submitted.
- [ ] Type generation is documented and repeatable.

## Evidence bundle
- Lint outputs (Vale/markdownlint/link check): Not run (no configs found).
- Brand check output: Not run (no brand check script found).
- Readability output (if available): Not run (no readability script found).
- Checklist snapshot: Pending maintainer confirmation.

## Reference
- Scripts: `package.json`
- Environment template: `.env.example`
- Worker config: `wrangler.jsonc`
