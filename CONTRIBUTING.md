# Contributing guidelines for this MCP boilerplate

This doc explains how to propose changes safely and keep the template stable for downstream users.

Last updated: 2026-01-08
Owner: TBD (set maintainer/team)
Review cadence: Quarterly (confirm)

## Doc requirements
- Audience tier: Intermediate
- Scope: Local setup, change workflow, and quality checks for contributors
- Non-scope: Product roadmap, release management policies, and vendor account setup
- Required approvals: Maintainer approval for production-impacting changes (confirm)

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
- Assumptions: You can run `pnpm` and `wrangler` locally.
- Risks / blast radius: Changing auth or billing flows can break downstream apps.
- Rollback / recovery: Revert the commit and redeploy a known-good build.

## Prerequisites
- Required: Node.js 20+, pnpm, Wrangler CLI
- Optional: Stripe and OAuth test accounts for integration validation

## Quickstart
### 1) Install dependencies
```sh
pnpm install
```

### 2) Run the dev environment
```sh
pnpm dev
pnpm dev:worker
```
Run each command in a separate terminal.

### 3) Verify
Expected output:
- Vite prints a local dev server URL.
- Wrangler prints a local worker URL and no startup errors.

## Common tasks
### Run quality checks before submitting
- What you get: Type safety and lint/test feedback.
- Steps:
```sh
pnpm typecheck
pnpm lint
pnpm test
```
- Verify: Commands exit with status 0.

### Update documentation when behavior changes
- What you get: Docs stay aligned with code changes.
- Steps:
```sh
# Update README.md and docs/*
```
- Verify: Doc requirements and acceptance criteria sections are updated.

### Add a new MCP tool
- What you get: A new tool registered at startup.
- Steps:
```sh
# Add a file under src/tools/free/ or src/tools/paid/
```
- Verify: The tool appears in the server registration logs.

## Troubleshooting
### Symptom: Tests fail after a change
Cause: Behavior changes without updated tests.
Fix: Update tests or adjust the change to align with existing behavior.

### Symptom: ESLint errors block the change
Cause: Formatting or rule violations.
Fix: Correct code to satisfy `pnpm lint` output.

### Symptom: `wrangler dev` fails to start
Cause: Missing or invalid `.env` values.
Fix: Re-copy `.env.example` and update required keys.

## Acceptance criteria
- [ ] Changes include tests or clear reasoning for omission.
- [ ] `pnpm typecheck`, `pnpm lint`, and `pnpm test` pass.
- [ ] Documentation is updated for user-facing changes.
- [ ] Security-sensitive changes include a review note.
- [ ] Maintainability and backward compatibility are considered.

## Evidence bundle
- Lint outputs (Vale/markdownlint/link check): Not run (no configs found).
- Brand check output: Not run (no brand check script found).
- Readability output (if available): Not run (no readability script found).
- Checklist snapshot: Pending maintainer confirmation.

## Reference
- Code style: `CODESTYLE.md`
- Project layout: `src/worker`, `src/auth`, `src/billing`, `src/tools`, `src/app`
- Commands: `pnpm typecheck`, `pnpm lint`, `pnpm test`
