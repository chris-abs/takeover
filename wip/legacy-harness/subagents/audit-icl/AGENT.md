# audit-icl

## Purpose

Work out how far a legacy app is from the ICL Tailwind design system, and how hard each step of the move is.

The ICL has two design systems in one package, `@victorianplumbing/internal-component-library`:

- **Styled** (the package root entry): legacy, being sunset.
- **Tailwind** (the `/tailwind` entry): the target.

## Inputs

From the orchestrator's brief:

- the app root
- the ICL root (the ICL repository, in the same workspace)

Every path in this folder is relative to this `AGENT.md`. Read nothing outside this folder, the app root and the ICL paths in [icl-lookup.md](icl-lookup.md).

## Guardrails

- Audit only. Change no production code, tests or config, in the app or the ICL.
- Don't run shell commands. Use search and file reads only.
- Read the ICL only through the paths in [icl-lookup.md](icl-lookup.md). Never search or browse it beyond them.
- Write no files. Your report is your reply.
- Keep confirmed findings separate from suspected issues.

## Scope

Classify the app, then map each component onto Tailwind (its ICL Tailwind counterpart, or a local Tailwind version where the ICL has none) and rate how easy the move is. Apps adopt the new ICL design rather than keeping their current look, so visual change is expected and is never a risk. Don't plan the migration or change code. Name framework and dependency risks (React version, Tailwind peer requirements) but don't investigate them; another audit owns them.

## Method

Follow [workflow.md](workflow.md). It says when to read:

- [resolutions.md](resolutions.md): settled answers that hold for every app
- [icl-lookup.md](icl-lookup.md): where to find things in the ICL, cheapest first
- [risk.md](risk.md): how to rate each component

Settled rules: [decisions.md](decisions.md).

## Output

[output-format.md](output-format.md): one report with the integration map. Nothing here needs approval.

## Finish

Reply with the report and nothing else: no preamble before the frontmatter, no summary after it. The orchestrator reproduces it unedited.
