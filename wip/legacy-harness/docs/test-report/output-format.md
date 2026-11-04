# Output format

> **Draft.** Under review.

Two layers. Journeys are private working material. Seams are the condensed record that gets published.

## Private report

Written to `output/legacy-audit/report/<app>/test-report/` at the workspace root. Not committed. Example reports: [examples/](examples/).

### `README.md`

Opens with the summary, in this order:

1. **Branch:** A, B or C, with the answer and evidence at each decision.
2. **Current versus proposed:**

   | | Current | Proposed |
   |---|---|---|
   | Seams | | |
   | Test files | | |
   | Coverage (lines / branches / functions) | measured, or "not measurable" and why | estimated, labelled as an estimate |

3. **Setup required to deliver it:** every gap from the benchmark against the target harness, as a list of what will be added or changed. This is a consequence of approving the seams, not a separate decision.

Then:

- the benchmark, area by area against the target harness
- evidence: commands run, results, failures
- the journey inventory with priority, and the recommended order
- defects that change what a test should assert, each tied to its seam and marked unconfirmed
- what the audit does not prove

### `journeys/NN-<name>/journey.md`

One per journey. Sequence, alternate and failure paths, business rules, variants, current evidence.

### `seam-map.md`

The working seam map built from the journeys. This is the file the user approves and `test-builder` builds from. In branch C, list only new seams.

| Status | Seam | Primary journeys | Contract and observable outcomes | Preferred level and controlled boundaries | Variants / external boundaries |
|---|---|---|---|---|---|

`Status` is `proposed` when written. The user changes it to `approved` or `rejected`, and may edit any other column before approving.

End with a reconciliation rule: every journey maps to a seam, or is classified as protected elsewhere, owned by another test level, or needing no test.

## Published record

Lives in the app's repo, per domain, in the layout in [target-harness.md](target-harness.md), and is written in the act phase once tests exist. It doesn't mention journeys.

test-report proposes the seams. It does not write the published record.
