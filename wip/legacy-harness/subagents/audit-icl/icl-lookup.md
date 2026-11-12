# ICL lookup

All paths are relative to the ICL root. Check [resolutions.md](resolutions.md) first: a settled answer needs no ICL reads. Otherwise go through the tiers in order, and stop at the first one that settles the table and the rating.

If ICL source you've already read contradicts an ICL doc, note it as a docs gap. Never read extra files to find gaps, and never let one affect a rating.

Never read `packages/design-system/dist/` or a whole docs folder. Never read `migrationMapData.ts` whole; grep it. Don't read styles or class maps to compare visual design. If a file named here is missing, record the gap in the report and move on; don't search for it.

| Short name | Path |
|---|---|
| Map | `packages/docs/src/docs/tailwind/Home/migrationMapData.ts` |
| Docs | `packages/docs/src/docs/tailwind/<destination>/` |
| Source | `packages/design-system/src/tailwind/components/<destination>/` |
| Styled source | `packages/design-system/src/styled/components/<source>`, where `<source>` is the map entry's `source` |

## Tier 1: find the counterpart

**A styled component or export.** Grep the map for its name inside `from:`, with about 8 lines after each hit (`from: '.*<Name>`). A name can appear in more than one entry, such as `FormMapper`; take every hit. Each entry gives:

- `kind`: `retained`, `renamed`, `composed`, `utilities` or `unavailable`
- `to` and `destination`: the counterpart, and the folder its docs and source live in
- `note`: the migration guidance in one line

An `unavailable` entry goes in the local Tailwind table. Read its styled source once to see what behaviour has to be rebuilt; that's the only time to read styled source. If the name has no entry at all, treat it as an app component and use the next paragraph.

**An app component with no ICL entry.** Glob `packages/design-system/src/tailwind/components/**/index.ts` to list the Tailwind components by folder. Match by role, not name: a bespoke `PrimaryBtn` maps to `Actions/Button`. If nothing fits the role, or the component is app-specific, it goes in the local Tailwind table and needs no further ICL reads.

## Tier 2: compare props

**A styled component:** read `<Docs>/mapping.ts`, the styled → Tailwind prop table. Use the props' types only when the table doesn't cover a prop the app uses.

**An app component, or a prop the table doesn't cover:** read the counterpart's props:

- `<Source>/types.ts` if it exists
- otherwise grep `<Source>/<Component>.tsx` for `Props =` or `interface .*Props`, with enough lines after to cover the type

Compare these with the props in use at every call site, not just the common ones. If every behavioural prop has an equivalent, the rating is settled. An equivalent can have a different name or be a composed part; the `mapping.ts` row says which. Appearance props map to tones, variants or utilities ([risk.md](risk.md)), so don't check their values.

Form field adapters prefix their file names: `Forms/Fields/<Field>/<Field>.mapping.ts`, `<Field>.migration.mdx` and `<Field>.mdx`. If a `<Docs>` folder has neither form, try its parent folder once.

## Tier 3: confirm a gap

Read these only when tier 2 leaves a behaviour without a direct equivalent:

- `<Docs>/migration.mdx`: the composition change, with a before and after
- `<Docs>/<Component>.mdx`: what the component does. Use this for app components whose behaviour isn't clear from the props.

## Tier 4: setup

Read `.docs/standards/consumer-integration.md` once, for step 5 of the workflow only.
