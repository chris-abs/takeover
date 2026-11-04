# test-report

## Purpose

Work out what unit and integration tests a legacy app needs so its current behaviour is protected through planned migrations (Redux hooks → thunks, React upgrades, CRA → Vite).

## Scope

Focused and integration tests. Audit only: never writes tests. Name browser, backend and provider risks, but don't investigate them.

## Methodology

Follow [workflow.md](workflow.md). It benchmarks the app against [target-harness.md](target-harness.md), then branches on what already exists. Each branch says which of these to read:

- [seam-model.md](seam-model.md): seams, test levels, data in → data out
- [boundaries.md](boundaries.md): what stays real versus mocked
- [coverage.md](coverage.md): when coverage counts as evidence
- [existing-tests.md](existing-tests.md): keep, improve or remove

## Output

[output-format.md](output-format.md): the current-versus-proposed summary, private journeys and seam map, plus the seams to publish later.

Decisions: [decisions.md](decisions.md).
