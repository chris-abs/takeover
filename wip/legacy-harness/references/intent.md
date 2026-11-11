# Intent

The one statement of what legacy-harness is for and the rules every part of it follows. Subagents never read this file; anything they need is restated in their own folder.

## What it is for

Make a legacy app safe to change fundamentally (Redux hooks → thunks, React upgrades, CRA → Vite, the move to ICL Tailwind). First audit it, then protect its current behaviour with unit and integration tests, then make the changes with those tests in place.

## Shape

- **Orchestrator** (`SKILL.md`): runs the phases, briefs each subagent, reads their reports and writes the handover for the user. It never audits the app itself.
- **Subagents** (`subagents/<name>/`): each owns one domain. Its `AGENT.md` is the entry point; everything it needs lives in its `references/` (and `scripts/` where it has them). It reads nothing outside its own folder except the paths it's given.
- **Reports** (`output/legacy-audit/<app>/reports/<name>/`): what each subagent hands back. The report file is the return value, not the chat reply.
- **Handover** (`output/legacy-audit/<app>/handover/`): the orchestrator's account to the user, built only from the reports.

## Naming

Subagents are named `<phase>-<domain>`:

- **Phase:** `audit` (reads and proposes) or `build` (changes code from approved proposals).
- **Domain:** one word, the same for every phase that works on it: `tests`, `icl`, `framework`.

So `audit-tests` and `build-tests` share a domain. A new subagent picks an existing domain where one fits.

The short name is used everywhere inside the skill: the folder (`subagents/audit-tests/`), the report folder, the handover file and in prose. Where a name sits in a list shared with other tools, it gets the `legacy-harness-` prefix: the Claude agent name and its wrapper file (`adapters/claude/legacy-harness-audit-tests.md`).

## Settled rules

- Audit first, act second. Audit subagents only propose. Nothing is built from a proposal the user hasn't approved.
- The user approves by ticking a box in the subagent's report files. An unticked box is never built. The handover explains and links; it holds no boxes.
- Audit subagents run in parallel with no dependencies between them. Never pass one subagent's output to another. Each stays inside its own remit; overlaps are resolved in the handover.
- Subagents never preload this skill. Each gets only its own `AGENT.md` path and the paths it needs ([contract.md](contract.md)).
- Keep confirmed findings separate from suspected issues, in reports and in the handover.
- Outputs go to `output/legacy-audit/<app>/` at the root of the current workspace. Never commit them.
- The skill runs the same on Claude Code and Codex. Anything harness-specific lives in [harness.md](harness.md) or in a Claude wrapper under `adapters/claude/`, never in a subagent's instructions as the only way to do something.
