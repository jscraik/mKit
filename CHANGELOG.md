# Changelog for the MCP boilerplate

This changelog tracks notable changes for template consumers.

Last updated: 2026-01-08
Owner: TBD (set maintainer/team)
Review cadence: Each release (confirm)

## Doc requirements
- Audience tier: Beginner
- Scope: User-facing changes, breaking changes, and migration notes
- Non-scope: Internal refactors without user impact
- Required approvals: Maintainer approval for release notes (confirm)

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
- Assumptions: Releases are tagged and notes are curated.
- Risks / blast radius: Missing breaking changes can break downstream users.
- Rollback / recovery: Update notes and publish a corrective release.

## Prerequisites
- Required: A tagging or release process (configure this)
- Optional: Automated changelog tooling

## Quickstart
### 1) Record a change
Use these categories:
- Added
- Changed
- Deprecated
- Removed
- Fixed
- Security

### 2) Verify
Expected output:
- Each release entry includes a date and migration notes when needed.

## Common tasks
### Add an entry for a release
- What you get: Clear release notes for users.
- Steps:
```sh
# Edit this file under the next release heading.
```
- Verify: Changes are in the correct category.

### Mark a breaking change
- What you get: Clear migration guidance.
- Steps:
```sh
# Add details under "Changed" or "Removed" and include migration steps.
```
- Verify: Users can follow the migration steps.

## Troubleshooting
### Symptom: Users are surprised by breaking changes
Cause: Missing or incomplete migration notes.
Fix: Add explicit migration steps and highlight the change.

### Symptom: No version tags exist
Cause: Release process not defined.
Fix: Define a tagging convention and update this file.

### Symptom: Release notes are inconsistent
Cause: No standard format or owner.
Fix: Follow the categories above and assign an owner.

## Acceptance criteria
- [ ] Each release has a date and version.
- [ ] Breaking changes include migration steps.
- [ ] Security fixes are called out explicitly.
- [ ] Entries are concise and user-focused.

## Evidence bundle
- Lint outputs (Vale/markdownlint/link check): Not run (no configs found).
- Brand check output: Not run (no brand check script found).
- Readability output (if available): Not run (no readability script found).
- Checklist snapshot: Pending maintainer confirmation.

## Reference
- Contributing workflow: `CONTRIBUTING.md`

## [Unreleased]
- Added: Initial documentation baseline.
