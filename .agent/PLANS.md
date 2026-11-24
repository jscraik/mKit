# Plans

<!-- AGENT-FIRST-PLANS:START -->
## Plan Contract (Agent-first)

All significant implementation plans MUST use task graphs with explicit dependencies.

Validation command:

```bash
python3 /Users/jamiecraik/.codex/scripts/plan-graph-lint.py .agent/PLANS.md
```

Valid sample plan:

```yaml
tasks:
  - id: T1
    title: Define scope and constraints
    depends_on: []
  - id: T2
    title: Implement scaffold updates
    depends_on: [T1]
  - id: T3
    title: Run verification and publish report
    depends_on: [T2]
```

Optional cross-plan reference:

```yaml
external_dep: "/absolute/repo/path#T12"
```
<!-- AGENT-FIRST-PLANS:END -->

## Public onboarding update — 2026-11-24

```yaml
tasks:
  - id: DOCS-1
    title: Check onboarding against repository commands and prerequisites
    depends_on: []
    status: completed
  - id: DOCS-2
    title: Update the public README and preserve managed workflow contracts
    depends_on: [DOCS-1]
    status: completed
  - id: DOCS-3
    title: Validate changed documentation and record remaining review gates
    depends_on: [DOCS-2]
    status: completed
```

This update covers documentation only. Existing implementation and release
evidence above retains its original scope and dates.

Validation scope: repository commands and file links were checked. Environment
and maintainer-only gates that could not run are recorded in the PR handoff;
this task graph does not claim release or merge readiness.
