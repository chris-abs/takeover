# Output format

> **Draft.** Under review.

Two layers. Journeys are working material. Seams are the condensed record that gets approved, then built and published.

## Report

Your reply, and the only thing you produce: write no files. It opens with this frontmatter, then these sections in order: summary, details, journeys, seam map.

### Frontmatter

```yaml
---
schema: legacy-harness/report/v2
subagent: audit-tests
app: <app folder name>
commit: <full assessed commit>
assessed_on: YYYY-MM-DD
status: complete | incomplete
status_reason: <only when incomplete>
headline: <one sentence: the most important finding>
proposed: <number of SEAM-NN sections>
needs_input: 0
branch: A | B | C
---
```

`needs_input` stays 0: setup gaps are never questions for the user ([decisions.md](decisions.md)).

### Summary

In this order:

1. **Branch:** A, B or C, with the answer and evidence at each decision.
2. **Current versus proposed:**

   | | Current | Proposed |
   |---|---|---|
   | Seams | | |
   | Test files | | |
   | Coverage (lines / branches / functions) | measured, or "not measurable" and why | estimated, labelled as an estimate |

3. **Setup required to deliver it:** every gap from the benchmark against the target harness, as a list of what will be added or changed. This is a consequence of approving the seams, not a separate decision.

### Details

- the benchmark, area by area against the target harness
- evidence: commands run, results, failures
- the journey inventory with priority, and the recommended order
- defects that change what a test should assert, each tied to its seam and marked unconfirmed
- what the audit does not prove

### Journeys

One `#### JOURNEY-NN: <name>` section per journey: sequence, alternate and failure paths, business rules, variants, current evidence. Keep each short; they support the seams, they aren't the deliverable.

### Seam map

The working seam map built from the journeys. This is the section the user approves and `build-tests` builds from. In branch C, list only new seams.

One section per seam, in the recommended order:

```md
#### SEAM-NN: <seam name>

- [ ] Approve

- **Primary journeys:** <JOURNEY-NN IDs>
- **Contract and observable outcomes:** <what should happen, and what a test observes>
- **Preferred level and controlled boundaries:** <focused, integration or both; what is mocked>
- **Variants / external boundaries:** <variants to cover; risks owned elsewhere>
```

The box is written unticked. The user ticks it to approve, and may edit the seam's fields first. An unticked seam is never built. Keep `SEAM-NN` IDs stable when auditing again. Each seam section must stand alone: `build-tests` receives only the ticked ones.

After the seams, list what isn't a seam ([seam-model.md](seam-model.md)), with the reason for each. End with a reconciliation rule: every journey maps to a seam, or is classified as protected elsewhere, owned by another test level, or needing no test.

## Published record

Lives in the app's repo, per domain, in the layout in [target-harness.md](target-harness.md), and is written in the act phase once tests exist. It doesn't mention journeys.

audit-tests proposes the seams. It does not write the published record.
