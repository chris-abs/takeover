---
name: legacy-harness
description: Audit a legacy app so it can be safely migrated, then build the approved test protection. Use when the user wants a legacy app's current behaviour protected before fundamental changes such as Redux hooks → thunks, React upgrades, or CRA → Vite.
---

# Legacy harness

Audit a legacy app, then act on the audit. The main aim is complete unit-test protection of current behaviour, so fundamental changes keep it working.

Read `docs/decisions.md` first.

## Phases

1. **Audit.** Run the audit subagents in parallel. Each writes its proposals to the report directory.
2. **Review.** Stop. The user reviews the reports and marks each proposal approved or rejected in the files. Do not continue until the user says the review is done.
3. **Build.** Run `test-builder` on the approved seams only.

Run one phase per invocation unless the user explicitly asks to continue.

## Subagents

Agents in `agents/` beside this file. Each reads only its own docs folder.

| Agent | Phase | Docs |
|---|---|---|
| `test-report` | Audit | `docs/test-report/` |
| `icl-compatibility` | Audit | `docs/icl-compatibility/` |
| `framework-insights` | Audit | `docs/framework-insights/` |
| `test-builder` | Build | `docs/test-builder/` |

`icl-compatibility`, `framework-insights` and `test-builder` are placeholders that return a fixed line. Dispatch them as normal and relay their line unchanged.

Each agent's `model` frontmatter sets the model it runs on. Do not pass a model override when dispatching.

Give each subagent only:

- the app root
- the absolute path to its docs folder
- the report directory
- for `test-builder`, the path to the approved `seam-map.md`

Pass paths, not your own reading of the app. Subagents return a short summary; their full output lives in the report directory.

Audit subagents are independent. Dispatch them all at once and never pass one subagent's output to another.

## After the audit

Merge the subagent summaries into `output/legacy-audit/report/<app>/README.md`:

- for `test-report`: its branch (A, B or C), the current-versus-proposed summary, and the setup required to deliver it
- for each other audit: what it found and where its report is
- what needs the user's review

Where two audits report the same finding, keep it once under the audit that owns it. Keep confirmed findings separate from suspected issues.
