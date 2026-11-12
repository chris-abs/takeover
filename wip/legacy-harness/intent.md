# Intent

The one statement of what legacy-harness is for and the rules every part of it follows. Subagents never read this file; anything they need is restated in their own folder.

## What it is for

Make a legacy app safe to change fundamentally (Redux hooks → thunks, React upgrades, CRA → Vite, the move to ICL Tailwind). First audit it, then protect its current behaviour with unit and integration tests, then make the changes with those tests in place.

## Shape

- **Orchestrator** (`SKILL.md`): runs the phases, briefs each subagent, reads their replies and writes the handover for the user. It never audits the app itself.
- **Subagents** (`subagents/<name>/`): each owns one domain. Its `AGENT.md` is the entry point; everything it needs lives in the files beside it (and `scripts/` where it has them). It reads nothing outside its own folder except the paths it's given.
- **Reports:** what each subagent hands back, as the text of its reply. No subagent writes a report file.
- **Handover** (`output/legacy-audit/<app>/`): the only output. The orchestrator's account to the user, built only from the reports, with each report reproduced unedited so nothing is lost.

## Naming

Subagents are named `<phase>-<domain>`:

- **Phase:** `audit` (reads and proposes) or `build` (changes code from approved proposals).
- **Domain:** one word, the same for every phase that works on it: `tests`, `icl`, `framework`.

So `audit-tests` and `build-tests` share a domain. A new subagent picks an existing domain where one fits.

The name is used everywhere: the folder (`subagents/audit-tests/`), the handover file and in prose. Subagents are never registered with a tool, so the names never need a prefix.

## Settled rules

- Audit first, act second. Audit subagents only propose. Nothing is built from a proposal the user hasn't approved.
- The user approves by ticking a box in the handover, where each report is reproduced with the boxes its subagent wrote. An unticked box is never built. The orchestrator never writes or rewords a box, and ticks one only to carry over the user's own tick when an audit runs again ([handover.md](handover.md#running-again)).
- Audit subagents run in parallel with no dependencies between them. Never pass one subagent's output to another. Each stays inside its own remit; overlaps are resolved in the handover.
- Subagents never preload this skill. Each gets only its own `AGENT.md` path and the paths it needs ([contract.md](contract.md)).
- Keep confirmed findings separate from suspected issues, in reports and in the handover.
- Subagents reply in text. Audit subagents write nothing; `build-tests` writes only the app's test files. The handover in `output/legacy-audit/<app>/`, at the root of the current workspace, is the only file the skill writes. Never commit it.
- No tool-specific files or instructions. The skill is plain Markdown and scripts that any agent able to read skills can follow. A subagent is a general-purpose subagent given a brief ([dispatch.md](dispatch.md)), so its `AGENT.md` holds everything that defines it, guardrails included.
- Subagent entry points are named `AGENT.md`, not `SKILL.md`, so tools that collect skills from a folder don't list them as skills of their own.
