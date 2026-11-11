# Audit workflow

Audit only. Change no production code, tests or configuration. Never install dependencies.

Work down the tree. Record the answer and the evidence at every decision; the branch you land on is part of the report.

## 1. Benchmark the setup

Read the app's own guidance (README, AGENTS.md or similar), `package.json`, the build config, and the CI pipeline. Compare each area with [target-harness.md](target-harness.md):

- runner and libraries
- test files: count, locations, and naming
- Vitest projects and coverage configuration
- MSW and shared harness folders
- scripts
- CI gate
- dependencies: installed, or not installed and why

Every difference is a setup gap. Record it; do not propose it as a decision.

## 2. Decide: is testing in place?

Testing is in place when a runner is configured **and** at least one test file exists.

- **No** → branch **A**.
- **Yes** → step 3.

## 3. Run what exists

If dependencies are installed, run the existing tests and source-inclusive coverage. Record exact commands, results, failures, and lines, statements, branches and functions separately. Never fix a failure.

If dependencies are not installed, record why, and continue read-only. Coverage is then "not measurable".

## 4. Decide: are seams articulated?

Seams are articulated when the app has a published seam record per domain in the target format (`docs/testing/<domain>/seams.md`, see [target-harness.md](target-harness.md)).

- **No** → branch **B**.
- **Yes** → branch **C**.

## Branch A: no testing

Read [seam-model.md](seam-model.md) and [boundaries.md](boundaries.md).

1. Inventory journeys. Start from meaningful user, business or system journeys, not from files. For each: sequence, alternate and failure paths, business rules, variants.
2. Propose seams from scratch for every journey.
3. Estimate the coverage the proposed seams would reach.

## Branch B: tests, no seams

Read [seam-model.md](seam-model.md), [boundaries.md](boundaries.md), [coverage.md](coverage.md) and [existing-tests.md](existing-tests.md).

1. Inventory journeys, as in branch A.
2. Propose seams from scratch for every journey.
3. Map each existing test onto a proposed seam, and judge it: keep, improve or remove.
4. Estimate the coverage the proposed seams would reach, starting from the measured baseline.

## Branch C: tests and seams

Read [seam-model.md](seam-model.md), [coverage.md](coverage.md) and [existing-tests.md](existing-tests.md), and the app's own seam records.

1. Check each recorded seam against the code: does its agreed contract still describe the behaviour?
2. Inventory journeys, and find those no recorded seam protects.
3. Propose new seams for those gaps only. Do not re-propose recorded seams.
4. Judge existing tests against the seams they claim to protect.
5. Estimate the coverage the new seams would add to the measured baseline.

## 5. Reconcile

Every journey maps to a seam, a defensible no-test classification, or a named broader owner. Every credited test has an assertion that would catch the claimed regression.

## 6. Report

In the layout in [output-format.md](output-format.md).
