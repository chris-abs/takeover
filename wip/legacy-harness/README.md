# legacy-harness

Makes a legacy app safe to change fundamentally. It audits the app, hands the findings to you for review, then builds the test protection you approve.

The intent and settled rules are in [intent.md](intent.md).

## Flow

1. **Audit.** The orchestrator briefs three subagents, which run in parallel:
   - `audit-tests`: the journeys, seams and tests needed to protect current behaviour
   - `audit-icl`: how far the app is from ICL Tailwind, rated per component
   - `audit-framework`: the ordered commits to reach supported React, Vite and Node

   Each replies with its report as text and writes nothing. The orchestrator writes the handover: an explanation of each report, with the report itself reproduced below it.
2. **Review.** Read the handover's `README.md`, then tick `- [x] Approve` beside each seam or commit you approve, in the audit files it links to.
3. **Build.** `build-tests` builds the ticked seams (placeholder for now).

## Layout

```
SKILL.md                 orchestrator
intent.md                what it's for, naming and settled rules
contract.md              what subagents get and reply; approval boxes
dispatch.md              how subagents are started and their replies collected
handover.md              how the handover to the user reads
subagents/<name>/
  AGENT.md               the subagent's entry point
  *.md                   everything it needs to know
  scripts/               audit-framework only
```

Only the orchestrator is a skill. Each subagent is a general-purpose subagent given a brief that points to its `AGENT.md`. There are no tool-specific wrappers.

The handover is the only output, at the workspace root (never committed):

```
output/legacy-audit/<app>/
  README.md          the overview
  <subagent>.md      one per audit: explanation, then the report with its boxes
```

## Changing it

- Rules for everything: [intent.md](intent.md).
- What subagents get and reply: [contract.md](contract.md).
- How subagents are started: [dispatch.md](dispatch.md).
- How the handover reads: [handover.md](handover.md).
- A subagent's behaviour: its own `subagents/<name>/`. Subagents never read the orchestrator's files, so restate anything they need in their own folder.
