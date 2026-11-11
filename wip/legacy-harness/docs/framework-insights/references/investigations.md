# Investigate technical questions before asking the user

The assessor owns accessible technical investigation. A peer warning or incomplete future verification is not a request for the user to investigate. Keep registry/graph evidence unchanged; add findings that explain applicability and disposition. Do not weaken peer ranges, use force/ignore flags, select guessed versions or call a successful install runtime proof merely to make the assessment appear complete.

## Investigation loop

For each material warning:

1. State the exact consumer/version, required peer or API, current/selected versions, and which migration decision depends on it. Separate an existing baseline mismatch from a newly introduced constraint.
2. Check actual usage with Knip traces and source/config references. Determine whether a peer is required, optional and active, optional and inactive, or tooling-only. Unused app imports do not remove peer obligations.
3. Investigate with the relevant recipe below. Prefer read-only metadata, installed metadata resolution and published source/contracts. Recollect candidate metadata and regenerate the peer graph whenever targets change; keep selected versions and commit groups consistent.
4. Record the observation, evidence provenance and limitation. Resolve only the question actually answered. A matching installed consumer can prove visibility in that tree, not the future lock. Package source can establish API usage, not unperformed browser behaviour.
5. Either settle the decision, attach a bounded implementation verification gate, or identify the precise intervention that genuinely requires the user. If the remaining work is accessible technical investigation, continue it. Do not stop at “check compatibility”. Avoid exhaustive release fishing; investigate the nearest plausible compatible/bridge releases and broaden only when evidence warrants it.

An investigation ends when the necessary decision has enough evidence, the next evidence requires implementation, or further progress requires unavailable access or an external decision. This is not an architecture rewrite or permission to modify the application.

## Consumer-relative peer placement

```sh
node /path/to/skill/scripts/verify-peer-placement.mjs \
  --repo /path/to/app --graph /tmp/assessment/graph.json \
  --tools /path/to/external-tools --out /tmp/assessment/peer-placement.json
```

The script reads installed package metadata from each consumer's Node resolution search paths. It never imports the consumer or peer. It reports `observed-compatible`, `observed-conflict`, `optional-absent`, `required-peer-missing`, `source-not-comparable` or `unsupported-range` per edge. Only a consumer whose installed version matches the selected source version is compared. This avoids rejecting all evidence simply because some unrelated installed packages are stale.

- Required peer found at a compatible version: record the exact consumer-relative location/version and installed-tree provenance. Future Yarn resolution remains a per-commit verification gate.
- Optional peer absent: not a required installation problem. Installed but incompatible optional peer: inspect whether the associated feature is active; preserve the metadata mismatch and document any inactive-feature disposition. Do not call it peer-compliant or globally irrelevant.
- Optional build peers: inspect the chosen config language, config loader, minifier and optional integrations before adding packages. An .mjs config does not itself establish a requirement for TS config loaders or Node types. Check their actual use rather than removing every optional warning by installing peers.
- Required peer missing or range conflicting: find the smallest compatible package/peer adjustment, source adapter or removal, then verify the candidate metadata. Do not turn every placement warning into an upstream release request.
- Stale or missing consumer: no inference about that selected consumer's resolution. Use an available matching reference tree with explicit provenance, or leave a resolution gate for the authoritative package manager. Do not assert that another app's whole lock proves this app's placement.

Bundler aliases/ESM conditions may differ from Node filesystem lookup. For workspaces, Yarn PnP or custom resolution, use the repo's package-manager/resolver evidence and record unsupported cases.

## Private packages with restrictive React peers

First look for a published compatible release within a reasonable upgrade path. If none is established, inspect the exact package's source/contracts and used entry points, plus a comparable working reference app at the exact version. Published tarballs may be downloaded with `npm pack --ignore-scripts --pack-destination <external-dir>` using existing registry authentication; this downloads evidence without installing the package in the app. Keep extraction/source artifacts external and cite version, file and hash; do not publish credentials or raw registry failures.

Identify the React APIs actually used, renderer imports (including vendored/aliased ReactDOM), lifecycle assumptions and required app adapters. A package that merely declares a React peer differs from one that imports removed renderer APIs, but absence of a risky import is still not whole-app runtime proof. Record concrete findings instead of calling the declaration stale on intuition.

Permitted outcomes: a verified compatible target; a specific local adapter; a documented compatibility exception supported by relevant runtime checks or an accountable package-owner statement; or an unresolved decision. A peer metadata conflict remains recorded even when an exception is accepted. Another app installing/building successfully alone does not establish the exception. Do not automatically demand a producer release, a UI rewrite or a Router major migration.

## Installation evidence

Stale node_modules is a discovery limitation, not a reason to stop investigating unrelated package upgrades. Keep lock-selected baseline facts separate from observed installed candidate versions. Required target/resolution questions may need an isolated package-manager probe; if user authorization covers validation, run it in a disposable external directory with the authoritative manager/runtime and record exact inputs, resulting lock and command outcome. Do not create a repo/worktree, edit the user's checkout, copy secret env/credential files, or change registry configuration. Existing user registry authentication can be inherited. Skip lifecycle scripts for metadata-only resolution; do not describe that as a successful executable build. Candidate changes in a scratch probe are experiments, not implemented migration commits. If runtime validation isn't authorized, give the orchestrator the concrete probe rather than asking for speculative permission during every audit.

A frozen install of the original lock answers baseline reproducibility; a candidate resolution answers a different question. If source adapters are required for a candidate build, specify them rather than treating the expected pre-adapter failure as evidence that the package target is impossible.

Do not perform routine backend, VPN, CORS or local-login health checks as part of this assessment, and do not report their availability as migration issues. Preserve auth/origin contracts when changing build tooling; put a specific relevant check beside that commit. Only a demonstrated migration-induced configuration/API change belongs in its proposed remedy.

## Record conclusions

Keep detailed investigation in a JSON evidence artifact in the external workDirectory, never in the repo: question, packages/versions or source contracts involved, evidence and limits, conclusion, concrete remedy or next verification, and affected COMMIT IDs. Existing investigation IDs may remain in evidence for traceability; new IDs can use INVEST-NN. Do not reproduce this research as a standalone section in the main report or copy its JSON/probe executables into docs. Include the concrete conclusion beside the relevant commit.

Use three distinctions:

- **Change required:** a diagnosed version/API/config problem with its proposed remedy, included in the relevant semantic commit. A known incompatibility is work to plan, not a user problem by default.
- **Verification:** a specific implementation-time check with the expected result and a bounded response if it fails. Place it in that commit's Verify line; do not repeat routine install/build checks or create empty verification commits.
- **Needs your input:** actual missing access, unavailable resources or a genuinely external policy choice that the agent cannot establish independently. Diagnose execution/network context, inspect available metadata/source and try appropriate permitted alternatives first. Explain the exact intervention needed and the decision it prevents. Do not ask the user to read peer warnings, investigate package compatibility or confirm that untested code works.

No fixed declaration of “package-owner approval required” follows from a React peer mismatch. Investigate current support/source and focused runtime evidence where authorised; document relevant compatibility exceptions honestly. If a real organisational policy requires approval or only an inaccessible resource can answer the question, state that specific need. Otherwise finish the technical work or give a concrete implementation verification; do not invent access barriers or hide uncertainty by claiming compatibility.

Follow report-format.md for delivery. Plan complete describes the established plan, not completed implementation. No ready/blocked labels or old verdict vocabulary in the report. Raw tool diagnostic fields remain evidence and cannot set report status without interpretation.

Sources: [npm peer metadata](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#peerdependenciesmeta), [Node createRequire](https://nodejs.org/api/module.html#modulecreaterequirefilename).
