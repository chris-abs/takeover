# Evidence

Scripts gather facts; the agent interprets them. Script outputs go to the `workDirectory`. Paths below like `<tools>` and `<work>` stand for the paths `prepare-tools.mjs` and `prepare-output.mjs` returned.

## Usage: Knip

Knip 6.45.1 is pinned in `scripts/package-lock.json` and installed by `prepare-tools.mjs`. Never run an unversioned `npx knip`, and never add Knip to the app.

**Config.** Write a JSON config in `<work>`. Keep any existing Knip config's entries, aliases, workspaces and exclusions. Start from Knip's defaults and the built-in plugins for tools actually in the manifest, and add only missing entry, project or config paths. Don't make every source file an entry, because that hides unused files. Exclude build output, generated code and test support from production with project negations. A confirmed CRA-style SPA might start from:

```json
{
  "entry": ["src/index.{js,jsx,ts,tsx}!"],
  "project": ["src/**/*.{js,jsx,ts,tsx}!", "!src/**/*.{test,spec}.{js,jsx,ts,tsx}!", "!src/**/__tests__/**!", "!src/**/__mocks__/**!"],
  "jest": true
}
```

Adapt it to the actual files. Resolve aliases from the real tsconfig, jsconfig and bundler config. Knip's plugins evaluate the app's config files, so check them for side effects on startup before running.

**Run.**

```sh
node scripts/analyse-usage.mjs --repo <app> --tools <tools> --config <work>/knip.json --out <work>/usage.json
```

This runs full and `--production` analyses separately. Findings mean the analysis succeeded. A config or execution error is a failed analysis, never a clean result. Trace a package being upgraded with:

```sh
node <tools>/node_modules/knip/bin/knip.js --directory <app> --config <work>/knip.json --trace-dependency <package> --no-progress --no-exit-code
```

**Use.** Usage isn't version compatibility and isn't proof a package is safe to delete. Keep every direct dependency in collection until its removal is verified. Check scripts, dynamic and side-effect imports, peers and deployment references first. A dependency reported only in production mode may belong in `devDependencies`.

## Registry: collect evidence

```sh
node scripts/collect-evidence.mjs --repo <app> --out <work>/evidence.json [--targets <work>/targets.json]
```

Omit `--targets` for the baseline. A targets file maps package names to exact versions, or to `null` for a removal, such as `{"react":"18.3.1","react-dom":"18.3.1"}`. Never use `latest`. Pick candidates from the app's actual needs, not from that example.

The collector records direct declarations, locked and installed versions, overrides, hashes, the commit and exact-version metadata, and follows peer metadata where an exact version is known. It doesn't crawl the full tree or pick bridge releases. Options: `--offline`, `--timeout 20000`, and `--concurrency 4` (at most 8).

Supported lockfiles: npm v2 and v3, and Yarn classic v1. pnpm, Yarn Berry, npm v1, several lockfiles together, or ambiguous workspace hoisting need package-manager evidence; never guess. Failed lookups are recorded by cause (access, missing or hidden, network, timeout). An E404 can't tell a missing private package from a hidden one. A failed lookup is never a compatibility claim.

Use `scripts/registry-preflight.mjs --repo <app> --public <pkg@version> [--private <pkg@version>] --out <work>/preflight.json` to check access before a full collection. A successful collection makes it unnecessary.

## Compatibility graph

```sh
node scripts/compatibility-graph.mjs --evidence <work>/evidence.json --out <work>/graph.json --node-version <app node version> --semver-from <tools>
```

The graph shows peer edges, optional peers, Node engine checks, range conflicts, unverified metadata, ordering constraints and groups that must move together. Ordering for a selected pair:

- The new source rejects the old peer but accepts the selected one: upgrade the peer first.
- The old source rejects the selected peer: upgrade the source first.
- Both are true (a cycle): those versions move together, unless a bridge release or a removal breaks the cycle.

A cycle only explains grouping for the recorded candidates. No cycle doesn't prove separate commits are safe: source APIs, engines, overrides and intermediate installs still need checking. `peer-constraints-satisfied` means only that the recorded checks passed.

## Peer placement

```sh
node scripts/verify-peer-placement.mjs --repo <app> --graph <work>/graph.json --tools <tools> --out <work>/placement.json
```

This reads installed package metadata from each consumer's resolution paths without importing anything. Use it as observation evidence when investigating ([investigations.md](investigations.md)).

## Freshness

Collect again after any manifest, lockfile or target change. Keep locked versions separate from stale installed modules.
