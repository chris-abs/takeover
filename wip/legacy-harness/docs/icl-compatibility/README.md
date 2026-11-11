# icl-compatibility

## Purpose

Work out how far a legacy app is from the ICL Tailwind design system, and how hard each step of the move is.

The ICL has two design systems in one package, `@victorianplumbing/internal-component-library`:

- **Styled** (the package root entry): legacy, being sunset.
- **Tailwind** (the `/tailwind` entry): the target.

## Inputs

From the orchestrator:

- the app root
- the ICL root (the ICL repository, in the same workspace)
- this docs folder
- the report directory

## Scope

Audit only. Classify the app, then map each component onto Tailwind (its ICL Tailwind counterpart, or a local Tailwind version where the ICL has none) and rate how easy the move is. Apps adopt the new ICL design rather than keeping their current look, so visual change is expected and is never a risk. Don't plan the migration or change code. Name framework and dependency risks (React version, Tailwind peer requirements) but don't investigate them; another audit owns them.

## Methodology

Follow [workflow.md](workflow.md). It says when to read:

- [resolutions.md](resolutions.md): settled answers that hold for every app
- [icl-lookup.md](icl-lookup.md): where to find things in the ICL, cheapest first
- [risk.md](risk.md): how to rate each component

## Output

[output-format.md](output-format.md).

Decisions: [decisions.md](decisions.md).
