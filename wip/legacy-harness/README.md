# legacy-harness

Makes a legacy app safe to change fundamentally. It audits the app, hands the findings to you for review, then builds the test protection you approve.

The intent and settled rules are in [references/intent.md](references/intent.md).

## Flow

1. **Audit.** The orchestrator briefs three subagents, which run in parallel:
   - `audit-tests`: the journeys, seams and tests needed to protect current behaviour
   - `audit-icl`: how far the app is from ICL Tailwind, rated per component
   - `audit-framework`: the ordered commits to reach supported React, Vite and Node

   Each writes a report. The orchestrator reads the reports and writes the handover.
2. **Review.** Read `handover/README.md`, then tick `- [x] Approve` beside each seam or commit you approve, in the report files it links to.
3. **Build.** `build-tests` builds the ticked seams (placeholder for now).

## Layout

```
SKILL.md                 orchestrator
references/              intent, contract, handover, harness
subagents/<name>/
  AGENT.md               the subagent's entry point (deliberately not SKILL.md)
  references/            everything it needs to know
  scripts/               audit-framework only
adapters/claude/legacy-harness-<name>.md  Claude Code wrappers: model and tools
agents/openai.yaml       Codex display metadata for the orchestrator
```

Only the orchestrator is a skill. Codex treats any `SKILL.md` under its skills folder as a skill of its own, so subagent entry points are named `AGENT.md` and the orchestrator passes their path in each brief.

Subagents are named `<phase>-<domain>` (`audit-tests`, `build-tests`). Claude agent names add a `legacy-harness-` prefix. See [references/intent.md](references/intent.md#naming).

Output, at the workspace root (never committed):

```
output/legacy-audit/<app>/
  reports/<subagent>/report.md   subagent → orchestrator
  handover/README.md             orchestrator → you
  handover/<subagent>.md
```

## Install

One source, symlinked into each harness. From this folder:

### Claude Code

```bash
ln -sfn "$PWD" ~/.claude/skills/legacy-harness
```

```bash
for f in adapters/claude/*.md; do ln -sfn "$PWD/$f" ~/.claude/agents/; done
```

### Codex

Needs multi-agent enabled (`codex features list` shows `multi_agent`).

```bash
ln -sfn "$PWD" ~/.codex/skills/legacy-harness
```

## Changing it

- Rules for everything: [references/intent.md](references/intent.md).
- What subagents get and return: [references/contract.md](references/contract.md).
- How the handover reads: [references/handover.md](references/handover.md).
- Claude vs Codex differences: [references/harness.md](references/harness.md).
- A subagent's behaviour: its own `subagents/<name>/`. Subagents never read the root `references/`, so restate anything they need there.
