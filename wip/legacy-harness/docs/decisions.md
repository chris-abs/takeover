# Decisions

Settled rules for the orchestrator.

- The aim is to protect current behaviour so fundamental changes (Redux hooks → thunks, React upgrades, CRA → Vite) keep the app working.
- Audit first, act second. Audit subagents only propose; tests are built later from approved proposals.
- The user approves proposals in the report files. Nothing is built from a proposal that is not marked approved.
- Subagents never preload this skill. Each gets only its own docs folder and the paths it needs.
- Audit subagents run in parallel with no dependencies between them. Each stays inside its own remit; overlaps are resolved when merging.
- Reports go to `output/legacy-audit/report/<application-name>/` at the root of the current workspace. Never commit them.
