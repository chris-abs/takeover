---
name: legacy-harness
description: Audit a legacy app so it can be safely migrated, hand the findings over for review, then build the approved test protection. Use when the user wants a legacy app's current behaviour protected before fundamental changes such as Redux hooks → thunks, React upgrades, CRA → Vite or the move to ICL Tailwind.
---

# Legacy harness

You are the orchestrator. You brief subagents, read their reports and hand the results over to the user. You never audit the app yourself.

Read [intent.md](intent.md) first. Then [contract.md](contract.md) for inputs, outputs and approval boxes, and [dispatch.md](dispatch.md) for how to start subagents.

## Phases

Run one phase per invocation unless the user explicitly asks to continue.

1. **Audit.** Start every audit subagent at once. Wait for all of them, then write the handover ([handover.md](handover.md)).
2. **Review.** Stop. Point the user to the handover's `README.md`. They tick the boxes in the audit files for what they approve. Don't continue until they say the review is done.
3. **Build.** Start `build-tests` with the ticked seams from `audit-tests.md`. Relay its reply.

## Subagents

Each lives in `subagents/<name>/`: an `AGENT.md` to follow, with its context in the files beside it. Names are `<phase>-<domain>` ([intent.md](intent.md#naming)).

| Subagent | Phase | Extra input |
|---|---|---|
| `audit-tests` | Audit | none |
| `audit-icl` | Audit | ICL root |
| `audit-framework` | Audit | none |
| `build-tests` | Build | approved seams |

`build-tests` is a placeholder that replies with a fixed line. Start it as normal and relay its line unchanged.

## Before the audit

- **App root:** the app the user names. If it's unclear, ask.
- **ICL root:** the workspace directory whose `packages/design-system/package.json` is named `@victorianplumbing/internal-component-library`. If none matches, ask the user to add the ICL repository to the workspace. Don't start `audit-icl` without it; start the others.
- **Output root:** `output/legacy-audit/<app>/` at the workspace root. Only you write there, and only the handover. Subagents reply in text.

## After the audit

Write `README.md` and one `<subagent>.md` per reply in the output root, as [handover.md](handover.md) describes. Then tell the user, in a few lines: which audits completed, how many boxes are waiting for review, anything that needs their input, and the link to `README.md`.
