# Investigations

The agent owns every investigation it can reach. A peer warning isn't a task for the user. Never weaken peer ranges, use force or ignore flags, or guess versions to make the plan look complete.

## Loop

For each material warning:

1. State the consumer and version, the required peer or API, the current and selected versions, and which decision depends on it. Separate an existing mismatch from a new one.
2. Check actual usage with Knip traces and the source. Is the peer required, optional and active, optional and unused, or tooling-only? An unused import doesn't remove a peer obligation.
3. Investigate with the matching [recipe](recipes.md). Prefer read-only metadata and published source. Collect again and rebuild the graph whenever targets change.
4. Record what you found, where it came from and its limits. Resolve only the question the evidence answers.
5. End with a settled decision, a bounded verification attached to a commit, or a precise need for the user. Check the nearest plausible compatible or bridge releases first; look further only when evidence warrants it.

An investigation ends when the decision has enough evidence, the next evidence needs implementation, or progress needs access or a decision the agent can't get.

## Target options

For each target (React, the build tool, Node), list every major its maintainers still support at or above the app's current one, and assess each as an option:

- **Supported until:** the end-of-support date from the maintainers' release schedule.
- **Rejected by:** packages whose engine or peer ranges refuse the option, and native add-ons without a build for it. Use the compatibility graph.
- **Breaking changes that touch the app:** from the Major upgrades steps below, for every major crossed to reach the option, with the number of affected sites.
- **Effort:** exactly one of:
  - `version bump`: nothing changes except versions
  - `config`: changes to config, scripts or CI only
  - `code`: changes to app source
  - `blocked`: a rejection or breaking change with no known remedy

For Node, first record where Node runs: build tooling only (the built app is served without Node), or also at runtime (an SSR or Node server). When it runs only the tooling, check runtime breaking changes against the build config, scripts and tooling packages, not the app source.

An option already rejected doesn't need its breaking changes read.

## Major upgrades

Whenever a package, the build tool or the Node runtime crosses a major version:

1. Read its official migration guide or changelog for each major crossed, at the time of assessment.
2. List the breaking changes, then use Knip traces and grep to find which ones touch the app's code or config.
3. Put the changes and adapters that apply into that package's commit. When several majors each need substantial changes, step through them one commit at a time; otherwise go straight to the target major.
4. Give the commit a Verify line for the riskiest change that applies.

Never assume a major is safe because its peer and engine ranges pass.

## Peer placement results

`verify-peer-placement.mjs` reports `observed-compatible`, `observed-conflict`, `optional-absent`, `required-peer-missing`, `source-not-comparable` or `unsupported-range` for each edge.

- **Required peer at a compatible version:** record where and which version. Future resolution stays a verification on the commit.
- **Optional peer absent:** not a problem. If installed but incompatible, check whether its feature is used, and keep the mismatch on record.
- **Optional build peers:** check the actual config language, loader and integrations before adding packages.
- **Required peer missing, or a range conflict:** find the smallest adjustment, adapter or removal, then verify the candidate metadata.
- **Stale or missing consumer:** no inference. Leave resolution as a verification for the package manager.

Workspaces, Yarn PnP and custom resolution need the package manager's own evidence.

## Private packages with restrictive React peers

First look for a published compatible release within a reasonable upgrade path. If there isn't one, inspect the exact package's source:

- Download with `npm pack --ignore-scripts --pack-destination <work>` under the developer's existing authentication. Keep the files in `<work>` and cite the version, file and hash.
- Find the React APIs it actually uses, renderer imports (including vendored or aliased ReactDOM) and lifecycle assumptions.

A package that only declares a React peer is different from one that imports removed renderer APIs. Even so, the absence of a risky import isn't whole-app runtime proof.

Allowed outcomes:

- a verified compatible version
- a specific local adapter
- a documented compatibility exception backed by relevant runtime checks or a statement from the package's owners
- an unresolved decision

The peer mismatch stays on record even when an exception is accepted. Don't demand a new release, a UI rewrite or a Router major by default.

## Installation evidence

Stale `node_modules` limits what can be observed; it doesn't stop the assessment. Some resolution questions need an isolated package-manager probe. Run one only when the user has authorised validation, and only in a disposable directory under `<work>` with the app's own package manager and runtime. Never in the app checkout. Skip lifecycle scripts for metadata-only resolution, and don't call that a successful build. Without that authorisation, put the probe in the relevant commit's Verify line instead.

## Recording outcomes

Keep the detail as JSON in `<work>`: the question, packages and versions, evidence and limits, conclusion, remedy or verification, and affected commits (`INVEST-NN` IDs are fine). Then put only the conclusion beside the relevant commit:

- **Change required:** a diagnosed problem and its remedy, inside the commit that fixes it.
- **Verification:** a specific check during implementation, with the expected result and what to do if it fails, on that commit's Verify line.
- **Needs your input:** missing access, an unavailable resource or a genuine organisational decision, only after the agent has diagnosed it and tried the permitted alternatives.
