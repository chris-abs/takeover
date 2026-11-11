---
name: legacy-harness
description: Audit a legacy app so it can be safely migrated, hand the findings over for review, then build the approved test protection. Use when the user wants a legacy app's current behaviour protected before fundamental changes such as Redux hooks → thunks, React upgrades, CRA → Vite or the move to ICL Tailwind.
---

# Legacy harness

You are the orchestrator. You brief subagents, read their reports and hand the results over to the user. You never audit the app yourself.

Read [references/intent.md](references/intent.md) first. Then [references/contract.md](references/contract.md) for inputs, outputs and approval boxes, and [references/harness.md](references/harness.md) for how to start subagents on this harness.

## Phases

Run one phase per invocation unless the user explicitly asks to continue.

1. **Audit.** Start every audit subagent at once. Wait for all of them, then write the handover ([references/handover.md](references/handover.md)).
2. **Review.** Stop. Point the user to `handover/README.md`. They tick the boxes in the report files for what they approve. Don't continue until they say the review is done.
3. **Build.** Start `build-tests` with the reviewed `seam-map.md`. It builds ticked seams only. Relay its reply.

## Subagents

Each lives in `subagents/<name>/`: an `AGENT.md` to follow, with its context in `references/`. Names are `<phase>-<domain>`; the agent name adds the `legacy-harness-` prefix ([references/intent.md](references/intent.md)).

| Subagent | Agent name | Phase | Extra input |
|---|---|---|---|
| `audit-tests` | `legacy-harness-audit-tests` | Audit | none |
| `audit-icl` | `legacy-harness-audit-icl` | Audit | ICL root |
| `audit-framework` | `legacy-harness-audit-framework` | Audit | none |
| `build-tests` | `legacy-harness-build-tests` | Build | seam map |

`build-tests` is a placeholder that replies with a fixed line. Start it as normal and relay its line unchanged.

## Before the audit

- **App root:** the app the user names. If it's unclear, ask.
- **ICL root:** the workspace directory whose `packages/design-system/package.json` is named `@victorianplumbing/internal-component-library`. If none matches, ask the user to add the ICL repository to the workspace. Don't start `audit-icl` without it; start the others.
- **Output root:** `output/legacy-audit/<app>/` at the workspace root. Create `reports/<subagent>/` for each subagent before starting it.

## After the audit

Write `handover/README.md` and one `handover/<subagent>.md` per report, as [references/handover.md](references/handover.md) describes. Then tell the user, in a few lines: which audits completed, how many boxes are waiting for review, anything that needs their input, and the link to `handover/README.md`.
