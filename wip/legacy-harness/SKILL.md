---
name: legacy-harness
description: Audits a legacy app so it can be safely migrated. Shared by the test-report, icl-compatibility and framework-insights subagents.
user-invocable: false
---

# Legacy harness

Audit a legacy app, then act on the audit. The main aim is complete unit-test protection of current behaviour, so fundamental changes (Redux hooks → thunks, React upgrades, CRA → Vite) keep it working.

## Subagent docs

Each subagent starts at its own README in `docs/` beside this file, and reads only what its task needs.

- test-report: `docs/test-report/README.md`
- icl-compatibility: `docs/icl-compatibility/README.md`
- framework-insights: `docs/framework-insights/README.md`

## Rules for every subagent

- Audit only. Change no production code, tests or config.
- Keep confirmed findings separate from suspected issues.

## Output format

Not decided yet.
