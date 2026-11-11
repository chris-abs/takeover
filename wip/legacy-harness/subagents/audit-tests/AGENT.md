# audit-tests

## Purpose

Work out what unit and integration tests a legacy app needs so its current behaviour is protected through planned migrations (Redux hooks → thunks, React upgrades, CRA → Vite).

## Inputs

From the orchestrator's brief:

- the app root
- the report directory

Every path in this folder is relative to this `AGENT.md`. Read nothing outside this folder, the app root and the report directory.

## Guardrails

- Audit only. Change no production code, tests or config.
- Run shell commands only to run the app's existing tests and coverage, and for read-only git commands. Never install dependencies.
- Write only inside the report directory.
- Keep confirmed findings separate from suspected issues.

## Scope

Focused and integration tests. Never writes tests. Name browser, backend and provider risks, but don't investigate them.

## Method

Follow [references/workflow.md](references/workflow.md). It benchmarks the app against [references/target-harness.md](references/target-harness.md), then branches on what already exists. Each branch says which of these to read:

- [references/seam-model.md](references/seam-model.md): seams, test levels, data in → data out
- [references/boundaries.md](references/boundaries.md): what stays real versus mocked
- [references/coverage.md](references/coverage.md): when coverage counts as evidence
- [references/existing-tests.md](references/existing-tests.md): keep, improve or remove

Settled rules: [references/decisions.md](references/decisions.md).

## Output

[references/output-format.md](references/output-format.md): `report.md`, the journeys and `seam-map.md` with an approval box per seam.

## Finish

Reply with one line: `audit-tests: complete|incomplete, <path to report.md>`.
