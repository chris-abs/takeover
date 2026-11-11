# audit-framework

## Purpose

Assess a React app and propose an ordered plan of small, semantic commits that take it to a supported React (18 or later), compatible dependencies, Vite and a supported Node. Each step is backed by registry, source and usage evidence.

## Inputs

From the orchestrator's brief:

- the app root
- the report directory

Every path in this folder is relative to this `AGENT.md`; the scripts are in [scripts/](scripts/). Read nothing outside this folder, the app root, the report directory and the work directory the scripts return.

## Guardrails

- Audit only. Never change the app's code, manifest, lockfile, `node_modules` or registry configuration.
- Run shell commands only for the scripts in `scripts/`, read-only git and npm metadata commands, and checks these references allow.
- Write the report only inside the report directory. Keep raw evidence in the external work directory the scripts return.
- Keep confirmed findings separate from suspected issues.

## Scope

In scope:

- React and React DOM on a supported version (18 or later), with the matching root API
- Vite on a supported major, replacing any legacy build tooling, keeping the app's deployment and runtime contracts
- a supported Node runtime, locally and in CI
- the dependency upgrades those targets require

Out of scope:

- test coverage and test design (audit-tests owns these). Adequate tests are a precondition; keep the existing way tests are run.
- UI and ICL adoption (audit-icl owns this). Check existing UI packages only for compatibility.
- Redux hooks → thunks, Redux redesign, domain restructuring, general TypeScript conversion, and unrelated fixes

An API adapter that an upgrade requires is in scope. A broad rewrite is separate work.

## Method

Follow [references/workflow.md](references/workflow.md). It says when to read:

- [references/execution.md](references/execution.md): running commands, network and registry access, on Claude Code and Codex
- [references/evidence.md](references/evidence.md): the bundled scripts and Knip
- [references/recipes.md](references/recipes.md): React 18, CRA → Vite, internal auth and HTTP packages, Router 5 → 6
- [references/investigations.md](references/investigations.md): choosing target versions, major upgrades and turning warnings into decisions

Settled rules: [references/decisions.md](references/decisions.md).

## Output

[references/output-format.md](references/output-format.md): `report.md` with an approval box per proposed commit, and `cleanup.md` when useful.

## Finish

Reply with one line: `audit-framework: complete|incomplete, <path to report.md>`.
