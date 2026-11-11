# Workflow

Scripts live in `scripts/` beside this file. Resolve them relative to this docs folder; never assume an install location, username or OS temp path.

## 1. Start cold

Confirm the app root, its revision and any uncommitted work. Discover, don't assume:

- manifests, workspaces, the authoritative lockfile and package manager
- the real entry points, providers and routes
- build config and deployment conventions (base path, output folder, local HTTPS or origin)
- the app's profile: client-rendered SPA, SSR or hydration, or a non-web profile. SSR apps need their server and browser entries checked before Vite is proposed. Non-web profiles are out of scope; report that and stop.

Read any agent guidance in the app.

## 2. Prepare

Read [execution.md](execution.md), then run:

- `scripts/prepare-tools.mjs --repo <app root>`, which installs pinned Knip and semver outside the app and returns a tools path
- `scripts/prepare-output.mjs --repo <app root> --report <report directory>/README.md`, which returns an external `workDirectory`. Every JSON output, config, log and probe goes there.

## 3. Gather evidence

Follow [evidence.md](evidence.md):

1. Run Knip for usage, in full and production modes.
2. Collect a baseline with `collect-evidence.mjs`. Choose exact candidate versions from published metadata and actual integration needs, write a targets file, then collect again.
3. Build the compatibility graph with `compatibility-graph.mjs` for the chosen app Node version.

Read only the [recipes.md](recipes.md) entries that apply to the app.

## 4. Investigate

Turn each material warning into a decision with [investigations.md](investigations.md). Collect evidence again whenever the targets change.

## 5. Plan the commits

Order the commits from the graph's constraints and the recipes. Each commit:

- covers one reviewable concern and names its files and packages
- leaves the app installable and buildable
- includes manifest and lockfile changes with the package, plus any adapter that package requires

Consider, where they apply: a separate runtime upgrade, lint recovery, removing unused packages the migration needs gone, a parallel Vite build, keeping local HTTPS and origin, deployment output and base path, independent peer families, aligning React packages, activating the modern root, and switching the default scripts. Leave out what doesn't apply, and don't make catch-all dependency commits or empty research commits.

Separate installing a dependency from activating new runtime behaviour where a supported intermediate state allows it. Never separate an upgrade from the adapter it needs.

## 6. Write the report

Follow [output-format.md](output-format.md). Before finishing, check that:

- links work and the evidence matches the assessed revision
- every commit has a concrete scope and the order respects the graph
- each "Needs your input" item truly needs the user
- the app's working tree is unchanged
