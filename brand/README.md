# Brand asset usage for this repository

This folder stores brAInwav documentation assets for README signatures.

Last updated: 2026-01-08
Owner: TBD (set maintainer/team)
Review cadence: Annual (confirm)

## Doc requirements
- Audience tier: Beginner
- Scope: Asset usage and README signature guidance
- Non-scope: Marketing or visual design systems
- Required approvals: Maintainer approval for asset changes (confirm)

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
- Assumptions: Assets are used only for README signatures.
- Risks / blast radius: Misuse can create branding conflicts.
- Rollback / recovery: Restore the previous asset set from version control.

## Prerequisites
- Required: Use in root README only
- Optional: PNG fallback assets

## Quickstart
### 1) Use the README signature snippet
Add the following at the bottom of `README.md`:
```md
<img
  src="./brand/brand-mark.webp"
  srcset="./brand/brand-mark.webp 1x, ./brand/brand-mark@2x.webp 2x"
  alt="brAInwav"
  height="28"
  align="left"
/>

<br clear="left" />

**brAInwav**  
_from demo to duty_
```

### 2) Verify
Expected output:
- The README shows the brand mark and tagline at the bottom-left.

## Common tasks
### Replace a corrupted asset
- What you get: Restored brand assets.
- Steps:
```sh
# Replace files with the official asset pack.
```
- Verify: `brand-mark.webp` and `brand-mark@2x.webp` render in README.

### Use ASCII fallback
- What you get: A signature for text-only environments.
- Steps:
```text
brAInwav
from demo to duty
```
- Verify: Do not mix ASCII with image marks in the same doc.

## Troubleshooting
### Symptom: Image does not render
Cause: File path or filename mismatch.
Fix: Ensure `brand/brand-mark.webp` exists and the README path is correct.

### Symptom: Signature appears in the wrong location
Cause: Signature placed inside a section.
Fix: Move the signature to the README footer.

### Symptom: PNG fallback is missing
Cause: Optional assets not copied.
Fix: Add `brand-mark.png` and `brand-mark@2x.png` if needed.

## Acceptance criteria
- [ ] WebP assets exist in `brand/`.
- [ ] README includes the signature snippet at the bottom.
- [ ] ASCII fallback is used only when images are unavailable.

## Evidence bundle
- Lint outputs (Vale/markdownlint/link check): Not run (no configs found).
- Brand check output: Not run (no brand check script found).
- Readability output (if available): Not run (no readability script found).
- Checklist snapshot: Pending maintainer confirmation.

## Reference
- Brand guidelines: `/Users/jamiecraik/.codex/skills/docs-expert/references/BRAND_GUIDELINES.md`
