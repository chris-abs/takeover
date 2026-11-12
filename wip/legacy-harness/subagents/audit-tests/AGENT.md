# audit-tests

## Purpose

Work out what unit and integration tests a legacy app needs so its current behaviour is protected through planned migrations (Redux hooks → thunks, React upgrades, CRA → Vite).

## Inputs

From the orchestrator's brief:

- the app root

Every path in this folder is relative to this `AGENT.md`. Read nothing outside this folder and the app root.

## Guardrails

- Audit only. Change no production code, tests or config.
- Run shell commands only to run the app's existing tests and coverage, and for read-only git commands. Never install dependencies.
- Write no files. Your report is your reply.
- Keep confirmed findings separate from suspected issues.

## Scope

Focused and integration tests. Never writes tests. Name browser, backend and provider risks, but don't investigate them.

## Method

Follow [workflow.md](workflow.md). It benchmarks the app against [target-harness.md](target-harness.md), then branches on what already exists. Each branch says which of these to read:

- [seam-model.md](seam-model.md): seams, test levels, data in → data out
- [boundaries.md](boundaries.md): what stays real versus mocked
- [coverage.md](coverage.md): when coverage counts as evidence
- [existing-tests.md](existing-tests.md): keep, improve or remove

Settled rules: [decisions.md](decisions.md).

## Output

[output-format.md](output-format.md): one report with the journeys and the seam map, an approval box per seam.

## Finish

Reply with the report and nothing else: no preamble before the frontmatter, no summary after it. The orchestrator reproduces it unedited.
