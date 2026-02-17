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
