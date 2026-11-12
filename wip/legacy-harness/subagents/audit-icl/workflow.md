# Workflow

Work through the steps in order. Do all of the app's inventory before reading anything in the ICL.

## 1. Check the ICL is available

If the ICL root is missing or `packages/docs/src/docs/tailwind/Home/migrationMapData.ts` isn't under it, reply with an incomplete report saying so and stop.

## 2. Classify

Grep the app's source (not `node_modules`) for imports from `@victorianplumbing/internal-component-library`. Also check its `package.json` dependencies.

| What the imports show | Classification | Next |
|---|---|---|
| Only `/tailwind` imports, and nothing from the package root | Tailwind | Reply with the short report in [output-format.md](output-format.md) and stop |
| Any import from the package root | Styled | Step 3, styled path |
| No ICL imports | No ICL | Step 3, no-ICL path |

Local wrappers built on ICL Tailwind are fine and don't change the classification.

## 3. Inventory the app

Use Grep and Glob. Read a file only when a grep can't show what you need.

Every call site counts. A rating is only as good as the call site with the most demanding use, so never sample:

- Find every call site with Grep, then collect the props at each one. Grep the JSX with a few lines of context. If the context ends before the tag closes, read that line range.
- Record each prop with the number of call sites that pass it, so a prop used in one place is still visible.
- Take every count from a grep result, never an estimate. Report exact totals.
- Mark props passed by spread (`{...props}`) as unknown at that call site.
- If the app wraps the component in its own pass-through component, follow the wrapper's call sites one level up and collect their props too.

**Styled path.** List every named import from the package root. For each:

- the files that use it, and the number of call sites
- each prop in use, with its call-site count
- whether the app restyles it: `styled(X)`, a `css` prop, or a theme override

List non-component imports too (`Tokens`, themes, styles such as `globalReset`, hooks, utils, types, `Zod`), each with its files and call-site count. Also list any of the app's own UI components that have no ICL counterpart in use, using the no-ICL path below.

**No-ICL path.** List the app's UI primitives: buttons, inputs, selects, checkboxes, modals, tooltips, tables, tags, tabs, links, typography, spinners, messages and the like. Include both the app's own components and third-party UI libraries. Skip feature components that only compose primitives. For each primitive, record its source, its call sites and props as above, how it's styled today (styled-components, CSS or Sass modules, global CSS, inline styles, a third-party library), and what it does that a plain HTML element wouldn't (keyboard handling, portals, form-library wiring, controlled state).

## 4. Sort, then rate

Apply [resolutions.md](resolutions.md) first, then follow [icl-lookup.md](icl-lookup.md) for each item the resolutions don't settle. Every item goes in one of three tables:

- **ICL integration:** the item has an ICL Tailwind counterpart and moves to it.
- **Local Tailwind:** the item has no ICL Tailwind counterpart and stays in the app, restyled with Tailwind. This is a normal outcome, not a failure.
- **Styled-entry dependencies:** non-component imports from the package root.

Rate each item on its table's scale in [risk.md](risk.md). Look up each ICL counterpart once, even when several app components map to it. Add each row to its table as soon as it's rated.

## 5. Setup required

List what the app needs before it can use any ICL Tailwind component, from tier 4 of [icl-lookup.md](icl-lookup.md). Report this as a consequence of migrating, never as a question.

## 6. Write the report

Use [output-format.md](output-format.md).
