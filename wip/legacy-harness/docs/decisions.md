# Decisions

Settled rules for every subagent.

- The aim is to protect current behaviour so fundamental changes (Redux hooks → thunks, React upgrades, CRA → Vite) keep the app working.
- Audit first, act second. Subagents only audit; tests are written later from the reviewed summary.
- Reports go to `output/legacy-audit/report/<application-name>/` at the root of the current workspace. Never commit them.
