# Contract

What the orchestrator gives each subagent, and what each subagent gives back.

## Output layout

All under `output/legacy-audit/<app>/` at the workspace root, where `<app>` is the app root's folder name.

```
reports/<subagent>/report.md     the subagent's report to the orchestrator
reports/<subagent>/…             files the subagent owns (seam maps, journeys, maps, cleanup)
handover/README.md               orchestrator → user: the overview
handover/<subagent>.md           orchestrator → user: one per audit
```

A subagent writes only inside its own `reports/<subagent>/`. Only the orchestrator writes `handover/`.

## Brief (orchestrator → subagent)

Every path absolute. Send this and nothing else: no reading of the app, no other subagent's output.

```
You are the <subagent> subagent of legacy-harness.
Follow: <skill root>/subagents/<subagent>/AGENT.md
App root: <path>
Report directory: <workspace>/output/legacy-audit/<app>/reports/<subagent>/
<extra inputs, below>
When finished, reply with one line: <subagent>: complete|incomplete, <path to report.md>
```

Extra inputs:

| Subagent | Extra |
|---|---|
| `audit-icl` | `ICL root: <path>` |
| `build-tests` | `Seam map: <path to the approved seam-map.md>` |

## Report (subagent → orchestrator)

`report.md` in the report directory. The orchestrator reads this file, not the chat reply. It opens with this frontmatter:

```yaml
---
schema: legacy-harness/report/v1
subagent: <name>
app: <app folder name>
commit: <full assessed commit, or "uncommitted" with the reason>
assessed_on: YYYY-MM-DD
status: complete | incomplete
status_reason: <only when incomplete: the specific reason>
headline: <one sentence: the single most important finding>
approvals: <path to the file with approval boxes, relative to the report directory, or none>
proposed: <number of approval boxes written>
needs_input: <number of items only the user can resolve>
---
```

Each subagent may add its own fields after these; its `output-format.md` says which. The body follows the subagent's `output-format.md`.

`complete` means the audit reached its conclusions, not that every future check has passed. Unfinished work the subagent could do itself is never `complete`.

## Approval boxes

Anything the user approves is a GitHub task-list item in the subagent's own files, one box per proposal, directly under its heading:

```md
### SEAM-03: Basket total recalculates on quantity change

- [ ] Approve
```

- Written unticked. Only the user ticks it (`- [x] Approve`).
- Ticked means approved. Unticked after review means rejected or deferred; nothing is built from it.
- The user may edit the proposal's text before ticking.
- Task-list items only work as list items, never inside a table cell.
- IDs (`SEAM-NN`, `COMMIT-NN`) stay stable when an audit runs again, so ticks can be carried over.
