# Usage evidence and compatibility graph

Use scripts for facts; use the assessor for source/API interpretation and a plan-first Markdown handoff. Detailed findings and raw script statuses stay in evidence; only concrete changes, their verification and genuine user needs belong in the main report. Scripts do not request app-manifest changes, fixes, app package installs or application API calls. Knip runs from separately installed tooling; its plugins may evaluate project configuration. See [knip.md](knip.md) before running it. Registry lookups use `npm view` in the selected package directory, so existing scoped registry authentication applies. No registry configuration or raw error output is saved. The registry client may use its normal cache/logs; outputs must never contain credentials.

## Cold setup

Resolve the script location from the actual installed skill directory. Run prepare-tools.mjs --repo <actual-target-repo>. The script reads its bundled manifest/lock via module-relative paths, checks the supported tool Node runtime, discovers npm on PATH, and installs pinned tools into a managed OS-temp cache outside the target using npm ci --ignore-scripts. It returns JSON with the absolute tools path, versions and whether it reused an existing installation. Supply this path to --tools and --semver-from in subsequent commands. It does not install globally or modify the app or registry configuration. A version/lock/platform/Node change selects a different cache. --cache-dir can choose another external cache location.

Check the bundled scripts/package.json engine before selecting a runtime; discover available Node installations/version managers when necessary. If Node/npm is truly unavailable and cannot be enabled through authorised setup, name the exact tool/access need. Do not assume a particular version manager, shell, OS package manager or preinstalled app dependencies. The npm launcher helper supports ordinary Unix symlinks/wrappers and Windows npm.cmd installations through npm's JavaScript CLI.

Run prepare-output.mjs --repo <actual-repo> to get an external per-run workDirectory under the OS user cache (or an explicit external --cache-dir). Use it for evidence, config and probe code; the helper returns the final Markdown destination without creating repo files. --report can set an explicit Markdown destination. All /path/to/... examples below are placeholders to replace with discovered paths, not required filesystem locations. The docs destination is for the final Markdown only; it does not imply source folders exist or authorise copying raw artifacts there. For workspaces, determine package ownership and authoritative manager before running per-package collection. Use supported package-manager evidence for unparsed locks instead of substituting another manager or guessing.

## Usage first

Run `scripts/analyse-usage.mjs` as described in [knip.md](knip.md). Its full-project and production results identify usage candidates; targeted Knip traces supply references for packages being upgraded. This does not replace registry metadata or the peer graph below. Do not drop a direct dependency from collection solely because Knip reports it unused.

## Developer-owned npm authentication

The skill does not parse or bundle credential contents. npm resolves its normal configuration for the current invocation: command/environment settings and the assessed checkout's project .npmrc, user config (normally .npmrc in that developer's home, overridable through npm settings), and global/built-in configuration. Existing registry scopes, credential helpers and environment-backed tokens remain theirs. npmCommand only discovers the executable; it does not supply credentials.

Collector/preflight/package queries use the assessed repo as cwd and inherit the process environment, so project/user settings apply. Tool preparation runs npm in its separate public-tool cache: it inherits user/environment configuration and does not copy the target repo's .npmrc. Respect any developer/company registry or mirror policy; diagnose which operation lacks access rather than assuming public tool installation and private app queries use identical settings.

For a colleague, preconfigured valid feed access should work unchanged. An explicit authentication/access error after execution/network checks is a genuine reason to request their sign-in or package permission using their normal process. A network failure is not grounds to reset credentials. The distributed zip, external tool cache setup and report must not contain copied .npmrc/.env files, tokens or raw credential-bearing npm errors. Token creation/renewal is a separately authorised user action, not part of cold setup.

## Registry access and execution lifecycle

Use scripts/registry-preflight.mjs for bounded live diagnosis instead of an unbounded manual npm view command:

```sh
node /path/to/skill/scripts/registry-preflight.mjs --repo /actual/repo --public react@18.3.1 --private @scope/package@1.2.3 --out /temporary/evidence/preflight.json
```

Replace package examples with exact public/private candidates relevant to the assessed repo; omit --private when none applies. The helper enforces a 20-second per-probe process deadline, disables npm's own repeated fetch retries, records success or a sanitised failure, and exits. A shorter --timeout is for tool testing, not grounds for declaring live access unavailable. Existing credentials/registry settings are inherited unchanged. Do not copy credentials, print npm configuration or reset authentication merely because a request times out.

Preflight is a diagnostic convenience, not a ceremonial gate: successful fresh public/private metadata records from the bounded collector already satisfy it. Do not keep a redundant hanging manual lookup as a prerequisite after collection has succeeded. Use the preflight helper first when execution/network access is unknown, so an entire collection does not repeat the same failure dozens of times.

When the environment already declares restricted networking, select its permitted network-enabled execution for live npm calls immediately. For exec_command, sandbox_permissions is a tool argument and must be set on each call that needs it; adding text to the shell command does not grant access. A successful escalated preflight does not grant access to a later default-mode collector.

If the preflight returns a timeout/network failure, check execution permissions and immediately retry the bounded helper using the available network-enabled execution mechanism (for example `sandbox_permissions: "require_escalated"`), subject to its approval controls. Run the collector with the same successful checkout, authentication context and execution mode. Success in another session is useful diagnostic evidence, but confirm the current execution context. If permission is denied or cancelled, report that execution limit; do not bypass it or label it a package incompatibility.

Treat timeouts as lookup failures with an unresolved cause until diagnosed. All public and private probes timing out suggests a shared execution/network issue; it does not establish broken private-registry credentials, unavailable versions or incompatible packages. Distinguish timeout, explicit authentication/access failures and missing-or-hidden versions in the report. A collector that writes an artifact containing failed lookups has completed its process, but has not verified compatibility.

Create and validate any targets JSON before passing `--targets`; omit the option for baseline collection. Missing input files (`ENOENT`) are invocation errors and should be corrected before diagnosing the registry.

A single preflight is bounded to 20 seconds per requested probe. Keep the active turn running and poll the retained terminal session until it exits; do not finish with “the preflight is still running”. If a previous manual probe is reported as running, check its session exit/output before waiting or launching a duplicate. If your own unbounded probe is genuinely still live past the deadline, stop that probe and use the bounded helper; do not kill unrelated processes. An empty tool response is not evidence that npm is still running.

The full collector, unlike one preflight, can outlast a terminal response window because it queries packages in batches and follows peer metadata. Launch it in a persistent terminal execution session, retain the session ID and poll until an exit code is observed. When orchestrating through `functions.exec`, await the terminal call and return its session ID; do not leave unawaited tool promises in an isolate that will end. An orchestration yield or empty output is not a process failure. After interruption, check whether the original process completed or remains active before launching a duplicate. Require the completion message, successful exit and a fresh parseable artifact with matching repo, revision, fingerprints and targets before consuming results. Summarize metadata status/reason counts without exposing raw registry errors. Continue the report workflow once collection succeeds; failed lookups require investigation, not an automatic end to the assessment.

## Collect

```sh
node /path/to/skill/scripts/collect-evidence.mjs --repo /path/to/repo --out /tmp/modernisation/evidence.json --targets /tmp/modernisation/targets.json
```

Targets are a JSON object mapping package names to exact candidate versions, or `null` for a proposed removal. Omit `--targets` for baseline collection. Never use `latest` as a selected target. The JSON below illustrates input shape only; choose verified candidates for the actual repo instead of copying its example pins. A candidate is not a recommendation until the graph and source contracts have been checked.

```json
{"react":"18.3.1","react-dom":"18.3.1","vite":"7.1.12"}
```

The collector records direct declarations, exact locked/current choices, installed mismatches, overrides/resolutions, hashes, timestamps, commit and exact-version metadata. It follows peer metadata when an unambiguous locked or supplied exact version is available. It does not crawl the full regular dependency tree or choose bridge releases automatically.

Options: `--offline` records unresolved lookups without network; `--timeout 20000` bounds each lookup; `--concurrency 4` (maximum 8) bounds parallel requests. Failures distinguish access/authentication, missing-or-invisible versions, network, timeout and unknown lookup errors. An E404 cannot reliably distinguish a missing private package from hidden access. Do not convert failed lookups into compatibility claims.

Supports npm lock v2/v3 and selector/version records from Yarn classic v1. pnpm, Yarn Berry, npm v1, multiple lockfiles and workspace/hoisting ambiguity require additional package-manager evidence; they are not silently resolved. Run per package manifest. A unique transitive peer version in a lock is only a candidate: placement/visibility remains unverified. Non-registry dependencies are not fetched. Review overridden/resolved packages explicitly; metadata alone does not prove override correctness.

## Graph

```sh
node /path/to/skill/scripts/compatibility-graph.mjs --evidence /tmp/modernisation/evidence.json --out /tmp/modernisation/graph.json --node-version <chosen-app-node-version>
```

Requires skill-pinned semver 7.7.2. Use --semver-from with the tools path returned by prepare-tools.mjs; the graph does not rely on the assessed app having semver installed. Do not add this dependency to the assessed app. The collector uses Node built-ins only.

Output includes selected peer edges, optional-peer handling, Node engine checks, exact-range conflicts, unverified metadata, ordering constraints and strongly connected candidate groups. Peer-only lock candidates remain unverified unless an explicit selected target establishes the intended version; eventual package-manager resolution must establish placement.

Ordering proof for a selected pair:

- New source rejects old peer but accepts selected peer: peer upgrade precedes source upgrade.
- Old source rejects selected peer: source upgrade precedes peer upgrade.
- Both constraints form a cycle: those selected versions need a coupled transition, unless a compatible bridge release or removal changes the graph.

A cycle explains grouping only for the recorded candidates; it does not prove every possible bridge is impossible. No cycle does not prove independent commits are safe: source APIs, regular dependencies, engine transitions, overrides and intermediate installs still need inspection. Failed or unsupported constraints need investigation, not guessed edges or automatic requests for user input. Resolve each connected conflict separately rather than grouping the whole app.

Use fresh evidence after manifest, lockfile or target changes. `peer-constraints-satisfied` means only those recorded peer/Node checks passed; it does not prove migration completion. The repo's actual package manager and existing execution checks remain authoritative for implementation validation.

## Investigate constraints

Use [investigations.md](investigations.md) to turn raw graph warnings into evidenced decisions. `verify-peer-placement.mjs` inspects matching installed consumers and their actual peer search paths without loading application code. Its output is observation evidence, not a replacement verdict for the selected future lock or an automatic compatibility exception.

## Output safety

Write evidence/graph/config/log/probe outputs only to the external workDirectory, never to the assessed repo. Publish only the final Markdown report and optional cleanup Markdown by default. Keep the conclusions self-contained; do not add cache or missing JSON links to the report. Keep credentials out of target files. Do not paste full npm config or raw failures into the report. Offline fixtures verify tools; they do not settle real private-package compatibility.
