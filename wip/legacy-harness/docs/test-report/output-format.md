# Output format

> **Draft.** Under review.

Two layers. Journeys are private working material. Seams are the condensed record that gets published.

## Private report

Written to `output/legacy-audit/report/<app>/test-report/` at the workspace root. Not committed. Example reports: [examples/](examples/).

- `README.md`: scope, evidence (tests run, source-inclusive coverage, failures), the journey inventory with priority, recommended order, unconfirmed risk probes, and what the audit does not prove.
- `journeys/NN-<name>/journey.md`: one per journey. Sequence, alternate and failure paths, business rules, variants, current evidence.
- `seam-map.md`: the working seam map built from the journeys.

| Seam | Primary journeys | Contract and observable outcomes | Preferred level and controlled boundaries | Variants / external boundaries |
|---|---|---|---|---|

End with a reconciliation rule: every journey maps to a seam, or is classified as protected elsewhere, owned by another test level, or needing no test.

## Published record

Lives in the app's repo, per domain, and is written in the act phase once tests exist. It doesn't mention journeys.

- `seams.md`: `Seam | Contract protected | Test references`
- `integrations.md`: implemented integration workflows mapped to existing seams
- `known-risks.md`: confirmed defects, disabled regression tests, residual risks

test-report proposes the seams. It does not write the published record.
