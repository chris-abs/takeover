# Migration-plan report contract

Use schema modernisation-assessment/v8. This report is the implementation handoff, not a transcript of discovery. Preserve useful COMMIT IDs when reassessing; a changed or retired proposal is not completed implementation.

## Reading order

1. **Status:** one small metadata line with repository, branch/commit, date and overall assessment status, then exactly three short lines: React current → proposed; dependencies current situation → proposed alignment; build/tooling current → proposed. No table. Put exact package pins in their commits rather than repeat them here.
2. **Proposed commits:** the main content. For each COMMIT-NN, use the semantic subject as its heading, a short concrete description, After only when prerequisites exist, and one concise Verify line focused on the risk introduced by that commit. Include the affected files/packages and exact selected versions where relevant. Explain why packages must move together in the description only when necessary. No Message/Status/Changes/Together-why boilerplate, ready/blocked labels, or repeated generic check lists. Conditional proposals state when to omit them and how to reconnect successors.
3. **Needs your input:** omit the entire section when empty. Each item states the specific intervention needed, why it is necessary, what the agent already tried and which decision it prevents. Examples: grant unavailable registry access, supply an inaccessible repository, decide a genuinely organisational release-policy question. Reachable source/metadata research, ordinary dependency selection, future checks and inactive optional tooling are not user tasks.
4. **Checks performed:** one sentence naming what actually ran and its material limitation. State the meaningful result/limitation without linking raw local artifacts; optionally link a separate cleanup Markdown. Do not append research/reference/catalogue sections to the main report.

YAML frontmatter contains schema, assessed_on, repository, branch, commit, assessment_status and testing: assumed-precondition. assessment_status is plan-complete or assessment-incomplete. Omit the old verdict field. The metadata line renders these as Plan complete or Assessment incomplete — <specific reason>. Plan complete means the decisions and sequence are sufficiently established, not that the upgrade was implemented or every future check passed. A repo already meeting the target can say Plan complete — no changes required, with no invented commits. If assessment remains incomplete because of agent-owned research, continue investigating where possible; never disguise it as a request for user input.

## Example shape

```md
---
schema: modernisation-assessment/v8
assessed_on: YYYY-MM-DD
repository: example-app
branch: main
commit: <full assessed commit>
assessment_status: plan-complete
testing: assumed-precondition
---

## Status

example-app · main @ <short commit> · YYYY-MM-DD · **Plan complete**

React: 17 → 18 with the modern client root.  
Dependencies: align the auth/HTTP peers; retain the compatible state packages.  
Build/tooling: CRA → Vite; preserve HTTPS, assets and deployment paths.

## Proposed commits

### COMMIT-01 — build(http): align the HTTP client peers

Upgrade <concrete packages and verified versions>, plus <required adapter files>; these versions must move together because <exact contract>.

Verify: <one concrete check of the changed integration>.

### COMMIT-02 — refactor(react): activate the modern root

Replace the legacy render call in <discovered entry file>; preserve providers and StrictMode.

After: COMMIT-01.  
Verify: <specific root/subscription behaviour>.

## Checks performed

Ran <actual checks>; <meaningful result and material evidence limit>.
```

This illustrates format, not a mandated package set, prerequisite order or claim that an entire migration fits two commits. Use as many small commits as the actual migration needs.

## Evidence and optional cleanup

Keep machine-readable registry/peer/usage facts and investigation records in the external workDirectory returned by prepare-output.mjs, not under docs or another repo folder. Record the question, evidence, conclusion, proposed remedy, affected COMMIT IDs and specific remaining verification; retain metadata/runtime distinctions. Raw diagnostic statuses do not set the report status automatically. New investigation IDs may use INVEST-NN; historical IDs can remain inside evidence for traceability but do not surface as a blocker inventory.

Migration-required cleanup belongs in its semantic commit. Put optional unused dependencies/files/exports in modernisation-cleanup.md (or an appropriate adjacent path), with concise candidate/verified/retain dispositions and enough concrete detail to understand the findings without a raw Knip JSON file. Omit that file/link when there is no useful optional cleanup. Do not duplicate it in the migration report.

Keep the main report terse: ordinarily one or two description sentences per commit plus necessary After and Verify lines. Keep lengthy private-package reasoning and compatibility matrices in the external cache; state the specific, supported conclusion near its commit without a cache-file link. Include limitations once, where they affect a decision, rather than repeating them across status, tables and validation.

## Publish and reveal

Default repo output is only docs/modernisation-assessment.md and optional docs/modernisation-cleanup.md. Do not publish an evidence directory. Use prepare-output.mjs --repo <actual-repo> to obtain a stable OS user-cache run directory for JSON, logs, config, source extracts and executable probes. The report can be drafted there, but publish only the final Markdown files; never recursively copy the run folder. An explicit request for raw debug artifacts can override this default. Do not add ignore rules to disguise generated noise.

The report and optional cleanup notes must be readable and reviewable without access to the machine's cache. Record conclusions, exact versions, meaningful verification results and necessary provenance in concise prose; cite available repo/official sources where useful. Do not link absent JSON, probe code or another developer's absolute cache paths. Give the cache location only in the final chat reply if useful for local diagnostics, not as a required report dependency. Before delivery, inspect the diff and ensure no scratch/config/executable files entered the repo.

After final validation, open/reveal the containing output folder once using host capabilities or scripts/reveal-output.mjs --report <absolute-final-report>. The helper uses native OS launchers without a shell and has no additional dependencies. It returns the actual report/folder paths and whether a reveal was requested, unavailable or failed. Use the actual discovered paths, never a username-specific location. Honour requests not to open a file manager. Headless/remote/denied desktop access is not an assessment failure: deliver the report and output-folder links, accurately stating if opening was unavailable. Include these links in the final reply, not another section in the report.
