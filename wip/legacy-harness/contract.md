# Contract

What the orchestrator gives each subagent, and what each subagent gives back.

## Output

Each subagent's report is its reply. Audit subagents write no files; `build-tests` writes only the app's test files. The orchestrator writes the only output, the handover, under `output/legacy-audit/<app>/` at the workspace root, where `<app>` is the app root's folder name:

```
README.md          the overview
<subagent>.md      one per audit: the explanation, then the subagent's report unedited
```

## Brief (orchestrator → subagent)

Every path absolute. Send this and nothing else: no reading of the app, no other subagent's output.

```
You are the <subagent> subagent of legacy-harness.
Follow: <skill root>/subagents/<subagent>/AGENT.md
App root: <path>
<extra inputs, below>
Reply with your report as text. Write no report files.
```

Extra inputs:

| Subagent | Extra |
|---|---|
| `audit-icl` | `ICL root: <path>` |
| `build-tests` | `Approved seams:` followed by every ticked `SEAM-NN` section from `audit-tests.md`, unedited |

## Report (subagent → orchestrator)

The reply is the report: Markdown, and nothing before it. It opens with this frontmatter:

```yaml
---
schema: legacy-harness/report/v2
subagent: <name>
app: <app folder name>
commit: <full assessed commit, or "uncommitted" with the reason>
assessed_on: YYYY-MM-DD
status: complete | incomplete
status_reason: <only when incomplete: the specific reason>
headline: <one sentence: the single most important finding>
proposed: <number of approval boxes in this report>
needs_input: <number of items only the user can resolve>
---
```

Each subagent may add its own fields after these; its `output-format.md` says which. The body follows the subagent's `output-format.md`. Material that would once have been a separate file (seam map, journeys, integration map, cleanup) is a section of the body.

`complete` means the audit reached its conclusions, not that every future check has passed. Unfinished work the subagent could do itself is never `complete`.

## Approval boxes

Anything the user approves is a GitHub task-list item in the report, one box per proposal, directly under its heading:

```md
### SEAM-03: Basket total recalculates on quantity change

- [ ] Approve
```

- Written unticked by the subagent. The orchestrator copies them into the handover unchanged. Only the user ticks one (`- [x] Approve`), in the handover.
- Ticked means approved. Unticked after review means rejected or deferred; nothing is built from it.
- The user may edit the proposal's text before ticking.
- Task-list items only work as list items, never inside a table cell.
- IDs (`SEAM-NN`, `COMMIT-NN`) stay stable when an audit runs again, so ticks can be carried over.
