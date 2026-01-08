# Security policy for the MCP boilerplate

This document defines how to report and handle security issues for this template.

Last updated: 2026-01-08
Owner: jscraik@brainwav.io
Review cadence: Quarterly (confirm)

## Doc requirements
- Audience tier: Intermediate
- Scope: Reporting, triage, and disclosure process for security issues
- Non-scope: Vendor security policies and incident response details
- Required approvals: Security owner approval for public disclosure (confirm)

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
- Assumptions: Maintainers can receive private reports and rotate secrets.
- Risks / blast radius: Leaked credentials, auth bypass, or payment misuse.
- Rollback / recovery: Revoke credentials, patch, and redeploy.

## Prerequisites
- Required: A private channel for security reporting (jscraik@brainwav.io)
- Optional: Public disclosure timeline policy

## Quickstart
### 1) Report a security issue privately
Send a report to jscraik@brainwav.io that includes:
- Steps to reproduce
- Affected versions or commits
- Impact assessment

### 2) Maintain triage timeline
Acknowledge within 3 business days (confirm) and provide updates until resolved.

### 3) Verify
Expected output:
- Reporter receives confirmation and a status update.

## Common tasks
### Report a vulnerability
- What you get: A private channel for coordinated disclosure.
- Steps:
```sh
# If hosted on GitHub, use Security Advisories.
# Otherwise, contact jscraik@brainwav.io.
```
- Verify: Maintainer confirms receipt.

### Rotate credentials after a leak
- What you get: Replacement tokens and revoked secrets.
- Steps:
```sh
# Rotate OAuth secrets, Stripe keys, and cookie encryption keys.
```
- Verify: Services authenticate with new secrets only.

## Troubleshooting
### Symptom: No response to a report
Cause: Security contact not configured.
Fix: Set a maintainer-owned contact and update this file.

### Symptom: Sensitive issue disclosed publicly
Cause: Reporter did not have a private channel.
Fix: Add clear private reporting instructions.

### Symptom: Fixes cannot be verified
Cause: No reproduction steps or environment details.
Fix: Request a minimal reproduction from the reporter.

## Acceptance criteria
- [ ] A private security contact is configured and published.
- [ ] Triage and response timelines are defined.
- [ ] Secret rotation steps are documented.
- [ ] Disclosure process is clear and consistent.

## Evidence bundle
- Lint outputs (Vale/markdownlint/link check): Not run (no configs found).
- Brand check output: Not run (no brand check script found).
- Readability output (if available): Not run (no readability script found).
- Checklist snapshot: Pending maintainer confirmation.

## Reference
- Sensitive configuration: `docs/configuration.md`
- Deployment steps: `docs/deployment.md`
