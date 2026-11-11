---
name: assess-repo-modernisation
description: Assess a React repository and produce a concise, ordered semantic commit plan for React 18+, compatible dependencies and Vite, backed by registry, source and external Knip evidence. Use for platform upgrade planning or reassessment; excludes architecture rewrites, hooks-to-thunks, UI-library adoption and test coverage assessment.
---

# Assess repo modernisation

Produce a migration plan with a short assessment attached, for a developer or implementation orchestrator. Write docs/modernisation-assessment.md, or the requested destination. Assessment does not authorise implementing the migration or changing the app's dependencies.

## Scope

Assess only React/React DOM 18+ with the appropriate root API, compatible dependencies, and Vite replacing legacy build tooling while preserving application and deployment contracts. Adequate testing is an assumed external precondition. Preserve existing test invocation; do not assess coverage or redesign testing infrastructure.

Do not add domain/interaction restructuring, hooks-to-thunks, Redux redesign, general TypeScript conversion, UI/ICL adoption, visualisation, or unrelated business fixes. Inspect existing UI packages for relevant compatibility only. A required API adapter is in scope; a broad rewrite is a separately scoped decision.

## Start cold

Resolve this skill's scripts and references relative to this SKILL.md; never assume an installation directory, username, OS temp path or another checkout. Identify the requested repository from the current workspace/user context and confirm its root, revision and local work before writing anything. Discover manifests/workspaces, authoritative lock/package manager, actual entries, providers/routes, build/config and deployment conventions. Read applicable local agent guidance. Do not assume src/, App/, a particular auth system, registry or reference app. Use [conventions.md](references/conventions.md) to identify profiles, not as a list of required local repos.

Check available Node/npm, repo runtime declarations and the network-execution instructions below before downloading tools. Prepare the pinned tools outside the app with scripts/prepare-tools.mjs --repo <absolute-repo-path>; it returns a tools path for subsequent commands. Read [tooling.md](references/tooling.md) for setup, registry preflight and persistent-process handling. If the current Node is too old, discover an available compatible runtime/version manager before requesting help; do not replace the developer's global runtime. Distinguish tool-runtime requirements from the app's proposed runtime. Tool setup must not alter the app manifest, lock, node_modules or registry credentials. Run scripts/prepare-output.mjs --repo <actual-repo> to allocate an external per-run investigation cache and return the final report path; use its workDirectory for every JSON output, temporary config, log, source snapshot and probe script. This step does not create anything in the repo.

## Network execution and registry identity

Registry access depends on the terminal tool's execution permissions, not just npm credentials. If the current environment declares network access restricted, run live npm operations (tool preparation, registry preflight, collection and package downloads) with its available network-enabled execution mechanism from the start. With exec_command this means the tool argument sandbox_permissions: "require_escalated", with the required justification—not a shell flag. That permission does not carry between chats or automatically apply to later tool calls. Use the successful execution mode again for the collector, not just the preflight. Follow current approval controls; if escalation is unavailable or denied, do not bypass it.

If a restricted probe returns network/timeout, rerun it through the permitted network-enabled tool call before stopping, asking the user or diagnosing npm authentication. A fast network failure is still an execution diagnosis, not a private-package incompatibility. An access refusal after the permitted retry may genuinely need the user's intervention; state which execution/access operation failed. Read tooling.md for the bounded helper and lifecycle handling.

Use each developer's own npm configuration and environment. The skill contains no organisation's credentials and must not copy the author's user configuration. Private queries run in the assessed checkout so npm can apply its repo/user/environment registry settings. A different developer needs their own account/feed access; ask them to use their team's normal authentication process only after identifying an actual auth/access failure. Never create or replace tokens, change registry configuration, or print/copy credential values as an automatic setup step.

## Gather evidence and investigate

1. Use [knip.md](references/knip.md) for a supporting usage pass with external configuration derived from actual entries/plugins. Run full and production modes separately. Consume concise counts and targeted traces; keep the full findings in the external investigation cache. Usage is not version compatibility or proof of safe deletion.
2. Run scripts/collect-evidence.mjs for the baseline. Inspect all direct dependencies and relevant peer constraints, including overrides. Select exact candidates based on published metadata and actual integration needs, create the targets JSON, then recollect. Use existing scoped registry authentication; use the bounded registry-preflight helper and its execution-context retry guidance before interpreting failed requests; do not wait indefinitely or stop at a “still running” update. Never expose credentials.
3. Run scripts/compatibility-graph.mjs using the prepared tools path and chosen app Node version. Use directional constraints and candidate cycles to establish ordering, checking bridge releases before coupling changes. Read applicable [recipes.md](references/recipes.md); do not treat reference versions as mandatory targets.
4. Investigate technical questions using [investigations.md](references/investigations.md), consumer-relative scripts/verify-peer-placement.mjs, source contracts and focused validation where authorised. Keep working when the necessary evidence is accessible. A package's restrictive peer declaration alone is not proof of failure; a successful install or another app's build alone is not proof of runtime compatibility. Establish the relevant conclusion and remedy instead of handing back “check compatibility”.

Keep source/version/lock fingerprints, provenance and limitations with the JSON evidence. Distinguish locked versions from stale installed modules. Unsupported lock formats or workspace placement require package-manager evidence, not guessed compatibility. Recollect when targets change. Raw tool fields such as blocked or blockers are diagnostics, not report labels or automatic requests for user input.

## Build the commit plan

Choose the minimum supported upgrade set. Retain packages where compatible. Router 6 and Redux major upgrades are conditional, not automatic consequences of React 18. Do not require non-hook clients or a particular folder structure.

Use stable COMMIT-NN IDs and Conventional Commit subjects. Each proposal covers one reviewable concern, names concrete files/packages and leaves a coherent installable/buildable intermediate state. Include manifest/lock changes with the package and any required API adapter. Explain coupling only when it changes the plan. Consider separate runtime, lint/check recovery, necessary unused-package removal, parallel Vite build, local HTTPS/origin preservation, deployment output/base, independent peer families, React package alignment, modern-root activation and final script activation. Include only applicable work; avoid catch-all dependency commits or empty research/documentation commits.

Distinguish dependency installation from new runtime activation when a supported intermediate API allows it. Use bridge releases or parallel build scripts where useful; do not separate a bump from adapters it requires. Investigate unknown targets rather than inventing pins or collapsing the migration into one commit. If an implementation-time condition remains, give a specific verification and bounded remedy/fallback; do not describe unperformed future checks as missing user input.

Diagnosed incompatibilities become changes required. Routine checks become verification beside the relevant commit. Only an unavailable resource, access/permission problem or genuinely external policy decision requiring the user's intervention belongs under Needs your input, after available diagnosis has been attempted. Do not request package-owner approval merely because a tool reported a peer warning. Do not end the assessment with technical research the agent can still perform.

## Deliver

Follow [report-format.md](references/report-format.md): three-line status, proposed commits, Needs your input only when necessary, and one sentence of checks performed. No standalone dependency tables, target-check tables, research narratives, blocker lists, per-commit readiness labels or routine environment-health findings. Optional cleanup goes in a separate linked file. Detailed evidence, candidate alternatives, reference comparisons and investigation history stay in the external investigation cache, not in the repo.

Do not audit or report whether a developer's backend/VPN/local login environment is currently working. Preserve auth/origin configuration where the migration changes it and attach a relevant verification; unrelated API availability/CORS setup does not belong in the assessment.

Publish only docs/modernisation-assessment.md and, when useful, docs/modernisation-cleanup.md (or the explicitly requested equivalents). These are the only default repo outputs. Do not create docs/modernisation/ or copy a run directory into the repo. Raw JSON, Knip config, logs/traces, downloaded packages and executable probe/helper code must remain outside the repo in the returned workDirectory. Export raw/debug artifacts into the repo only if explicitly requested. Do not hide generated files with gitignore changes.

Make the report self-contained: include the actual package/version decisions and meaningful check conclusions; use repo-source and official-source citations where useful, not links to unpublished JSON or local cache files. Detailed cached evidence remains available for local follow-up without becoming a review/commit requirement. Open/reveal the final Markdown's folder, not the internal cache.

Before delivery, verify report links, revision/evidence freshness, concrete commit scope, dependency ordering, and whether any user-input item truly requires user intervention; inspect the repo diff and confirm the only new outputs are the permitted Markdown files. Report Plan complete when the migration decisions are established; that does not claim implementation or runtime checks have passed. Otherwise explain the precise incomplete work without presenting agent-owned investigation as a user task. After saving and validating all final outputs, reveal the output folder once using an available host folder-reveal action, or scripts/reveal-output.mjs --report <absolute-saved-report>. It selects the saved report in Finder on macOS or opens its folder on other supported desktops; it does not launch the application. Respect a request not to open anything. In headless/remote/restricted environments, return links instead; failure to open a file manager must not prevent delivery or become a user-input issue. Return the report link, the output-folder link/path and any genuine action required from the user. Do not claim the folder opened if the launch did not succeed.
