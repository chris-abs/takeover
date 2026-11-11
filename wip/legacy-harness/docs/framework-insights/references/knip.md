# Knip usage evidence

Knip supplies source/config usage evidence for upgrade proposals and separate cleanup findings. Registry metadata, exact lock resolution and the compatibility graph still establish version constraints. Pin Knip 6.45.1 and its transitive runtime via `scripts/package-lock.json`; do not use unversioned `npx knip`.

## External runtime and configuration

Use scripts/prepare-tools.mjs as described in tooling.md to prepare a managed external pinned runtime; pass its returned tools path to the usage wrapper. Do not run npm install in the target or change its manifest, lock or node_modules to add Knip. Tool installation is separate from application installation. Existing target dependencies help resolve configuration; missing or stale installed dependencies must be recorded, not installed or silently treated as matching the lock.

Create a JSON assessment configuration in the external workDirectory returned by prepare-output.mjs. Do not copy it or raw usage JSON into the final docs folder. Inspect any existing Knip config and preserve relevant entries, aliases, workspaces and exclusions; explain adjustments rather than replacing conventions blindly. Do not copy secret/environment values into this file. Begin with defaults and applicable built-in plugins, adding only missing entry/project/config paths. Plugin `entry`/`config` overrides replace their defaults. Do not make all source files entries: that hides unused files/exports. Use project negations for build output, generated code and production-excluded test support; `ignore` suppresses findings without excluding files from analysis.

For a confirmed CRA-style single SPA, an example starting point is:

```json
{
  "entry": ["src/index.{js,jsx,ts,tsx}!"],
  "project": ["src/**/*.{js,jsx,ts,tsx}!", "!src/**/*.{test,spec}.{js,jsx,ts,tsx}!", "!src/**/__tests__/**!", "!src/**/__mocks__/**!"],
  "jest": true
}
```

Adapt this to actual files. Force Jest only if its configuration/tests are present but transitive ownership through CRA prevents automatic detection. Preserve setup files, scripts and nonstandard server/SSR entries. Do not assume a CRA plugin exists. Resolve aliases from tsconfig/jsconfig and actual bundler configuration; do not fabricate paths. Workspace analysis must include cross-workspace consumers before reporting deletion candidates.

Relevant plugin selection:

- Vite, webpack, Jest/Vitest, Babel, ESLint, Storybook, Playwright/Cypress and package script tooling: use only those present. Defaults generally auto-enable from direct manifest dependencies. Record actual discovery, not a guessed plugin list.
- React Router plugin detects `@react-router/dev` framework configuration, not Router 5 merely because `react-router-dom` is present. Ordinary SPA routes follow imported source from the application entry. Generated route types may be missing in newer framework repos; record that prerequisite rather than generating files during assessment.
- Framework/plugin config can be dynamically evaluated. Inspect relevant configuration for known write/startup side effects before execution; Knip's no-fix invocation does not sandbox project code. Do not claim a run is strictly read-only merely because the CLI lacks `--fix`. Missing configuration dependencies are explicit discovery limitations; do not disable plugins merely to make a report look clean.

## Run and validate discovery

```sh
node /path/to/skill/scripts/analyse-usage.mjs \
  --repo /path/to/app --tools /path/to/external-tools \
  --config /tmp/assessment/knip-config.json --out /tmp/assessment/usage.json
```

The wrapper verifies the pinned Knip version and runs full-project and `--production` analyses separately with JSON reporting, no progress and `--no-exit-code`. It does not enable fixes, watch or cache. Issue findings are successful analysis; execution/configuration errors are failed analyses, never an empty clean result. The raw artifact may use blocked as a diagnostic status; do not copy it into the report as a user-facing label. The artifact records versions, configuration/hash, revision, manifest/lock hashes, worktree state, findings, counts and failures. Compare before/after state; this is not a filesystem sandbox. Rerun after source/config/installed-dependency changes; untracked file contents and node_modules are not fingerprinted.

Inspect discovery using `--debug` when configuring or resolving suspicious findings: confirm actual application entries, project scope, enabled plugins and configuration hints. Keep raw debug output temporary; config evaluation may expose environment data. Record safe discovery facts and missing-entry/unresolved-import limitations in the evidence; mention a limitation in the main report only when material to its plan or checks. Do not suppress hints indiscriminately or interpret no findings as proof that everything is used. Standard JSON contains findings, not a complete import graph or configuration-quality certificate.

Production mode is an additional view, not a replacement for the default run. Its entries/project patterns need production markers (`!`), and it omits non-production script/config usage. A dependency reported only there may belong in devDependencies; source used only by tests is not automatically safe to delete. Do not use `--strict` by default; use it for an explicit workspace/peer-isolation question and label that run.

Trace material package candidates with the same runtime/config:

```sh
node /path/to/external-tools/node_modules/knip/bin/knip.js \
  --directory /path/to/app --config /tmp/assessment/knip-config.json \
  --trace-dependency react-router-dom --no-progress --no-exit-code
```

`--trace-file` and `--trace-export` answer narrower questions. Keep safe reference paths/lines as evidence for scope and commit grouping. Verify the actual bin path against the installed package's `bin` metadata. No custom graph exporter or additional dependency-analysis package is required for this pass.

## Consume findings

Join package findings to the complete manifest/lock/peer inventory; retain normal registry analysis for all direct dependencies until removal is verified. Check scripts, dynamic imports, side-effect imports, peers and external deployment references before upgrading an unused candidate or proposing removal. Azure deployment pipeline references and private framework conventions may need manual/source checks; built-in plugins do not establish their completeness.

For delivery, use report-format.md. Keep counts, discovery confidence and full findings in the external cache; do not create a Knip inventory section in the main plan. Put migration-required removal into its semantic commit. Put useful optional candidates in a separate linked cleanup file with candidate/verified/retain dispositions; unresolved discovery is evidence uncertainty, not automatic user intervention. A registered but unused business route is still statically used; Knip cannot establish real-world dormancy. Cleanup is not a fourth modernisation target.

## Sources

- [Plugins](https://knip.dev/explanations/plugins), [plugin reference](https://knip.dev/reference/plugins)
- [React Router](https://knip.dev/reference/plugins/react-router), [Vite](https://knip.dev/reference/plugins/vite), [Jest](https://knip.dev/reference/plugins/jest)
- [Project configuration](https://knip.dev/guides/configuring-project-files), [production mode](https://knip.dev/features/production-mode)
- [CLI arguments and exit codes](https://knip.dev/reference/cli), [JSON reporters](https://knip.dev/features/reporters), [workspaces](https://knip.dev/features/monorepos-and-workspaces)
