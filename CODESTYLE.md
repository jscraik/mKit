# Code style rules for the MCP boilerplate

This doc defines the baseline style and quality rules for this repository.

Last updated: 2026-01-08
Owner: TBD (set maintainer/team)
Review cadence: Quarterly (confirm)

## Doc requirements
- Audience tier: Intermediate
- Scope: TypeScript, React, and configuration style rules
- Non-scope: Detailed product design or security policy
- Required approvals: Maintainer approval for style rule changes (confirm)

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
- Assumptions: Contributors can run ESLint and TypeScript locally.
- Risks / blast radius: Inconsistent style reduces maintainability.
- Rollback / recovery: Revert style changes that break builds.

## Prerequisites
- Required: Node.js 20+, pnpm
- Optional: Editor ESLint integration

## Quickstart
### 1) Run lint and type checks
```sh
pnpm lint
pnpm typecheck
```

### 2) Verify
Expected output:
- Both commands exit with status 0.

## Common tasks
### Keep files small and focused
- What you get: Easier reviews and maintenance.
- Steps:
```sh
# Keep files under ~300 lines and functions under ~30 lines when practical.
```
- Verify: The file still reads clearly in a single screen.

### Use one main concept per file
- What you get: Predictable project structure.
- Steps:
```sh
# Prefer one component, hook, or type per file unless the type is trivial.
```
- Verify: File names map to exported symbols.

### Follow existing naming and casing
- What you get: Consistent imports and paths.
- Steps:
```sh
# Match existing casing in src/ and avoid new conventions.
```
- Verify: No unnecessary renames or churn.

## Troubleshooting
### Symptom: ESLint errors block a change
Cause: Violations of project lint rules.
Fix: Update code to satisfy `pnpm lint` output.

### Symptom: TypeScript build fails
Cause: Type errors in new or refactored code.
Fix: Address type errors or adjust typings.

### Symptom: File grows too large
Cause: Multiple concepts in one file.
Fix: Split into smaller modules.

## Acceptance criteria
- [ ] `pnpm lint` passes without warnings.
- [ ] `pnpm typecheck` passes.
- [ ] New files follow existing naming conventions.
- [ ] Files stay small and focused.

## Evidence bundle
- Lint outputs (Vale/markdownlint/link check): Not run (no configs found).
- Brand check output: Not run (no brand check script found).
- Readability output (if available): Not run (no readability script found).
- Checklist snapshot: Pending maintainer confirmation.

## Reference
- ESLint config: `eslint.config.js`
- TypeScript config: `tsconfig.json`
- Contributing workflow: `CONTRIBUTING.md`
