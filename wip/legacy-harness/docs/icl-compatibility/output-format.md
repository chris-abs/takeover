# Output format

> **Draft.** Under review.

Written to `output/legacy-audit/report/<app>/icl-compatibility/` at the workspace root. Not committed.

## Tailwind classification

`README.md` only: the classification and the import evidence. Nothing else.

## Styled or no-ICL classification

### `README.md`

Opens with the summary, in this order:

1. **Classification:** styled or no ICL, with the import evidence.
2. **Ratings:** for each table, the count of items rated 🟢, 🟠 and 🔴, and the exact total of call sites for each rating.
3. **ICL gaps:** props or behaviours the app uses that an ICL Tailwind counterpart lacks, one line each, naming the app component and call sites.
4. **ICL candidates:** local Tailwind components that could belong in the ICL, one line each. Mark styled ICL components with no Tailwind counterpart as such.
5. **Setup required:** what the app needs before any ICL Tailwind component works.

Then:

- unused components: defined but with no call sites, so not rated
- framework or dependency risks spotted in passing, named only
- ICL files the lookup expected but didn't find
- what the audit does not prove: for example, behaviour hidden behind props passed by spread

If you noted any ICL docs gaps, end with a short **ICL docs gaps** list: one bullet each, naming the doc and the source that contradicts it. Leave the section out when there are none.

### `integration-map.md`

Three tables, in this order. Within each, sort red, then amber, then green. Each item appears in one table only.

**ICL integration:** items with an ICL Tailwind counterpart.

| Rating | App component | Source | Call sites | Props used (call sites) | ICL Tailwind counterpart | Kind | Reason | Gaps | Design changes |
|---|---|---|---|---|---|---|---|---|---|

**Local Tailwind:** items that stay in the app, restyled with Tailwind.

| Rating | App component | Source | Call sites | Current styling | Why it stays local | Reason |
|---|---|---|---|---|---|---|

**Styled-entry dependencies:** non-component imports from the package root.

| Rating | Import | Call sites | Replacement | Reason |
|---|---|---|---|---|

- **Source:** the styled ICL export, the third-party library, or the app file that defines it.
- **Props used (call sites):** each prop with the number of call sites that pass it, such as `size (12), loading (1)`.
- **Kind:** the map `kind` for styled components. `matched` for app components matched by role.
- **Why it stays local:** `unavailable in ICL`, `no counterpart`, or `app-specific`.
- **Reason:** the props or behaviours that decided the rating, with `file:line` for the call sites that drive it ([risk.md](risk.md)).
- **Design changes:** visible differences between the app's current use and the ICL design, such as `Heading lg: 20px → 24px`. These are expected and never affect the rating. Leave it blank when the docs you read don't show one.
- **Replacement:** the answer from [resolutions.md](resolutions.md), or the `/tailwind` export that replaces the import.
