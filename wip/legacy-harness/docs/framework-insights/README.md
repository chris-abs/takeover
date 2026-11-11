# framework-insights

## Purpose

Assess a React app and propose an ordered plan of small, semantic commits that take it to React 18 or later, compatible dependencies and Vite. Each step is backed by registry, source and usage evidence.

## Inputs

From the orchestrator:

- the app root
- this docs folder
- the report directory

## Scope

In scope:

- React and React DOM 18 or later, with the matching root API
- the dependency upgrades those targets require
- Vite replacing legacy build tooling, keeping the app's deployment and runtime contracts

Out of scope:

- test coverage and test design (test-report owns these). Adequate tests are a precondition; keep the existing way tests are run.
- UI and ICL adoption (icl-compatibility owns this). Check existing UI packages only for compatibility.
- Redux hooks → thunks, Redux redesign, domain restructuring, general TypeScript conversion, and unrelated fixes

An API adapter that an upgrade requires is in scope. A broad rewrite is separate work.

## Methodology

Follow [workflow.md](workflow.md). It says when to read:

- [execution.md](execution.md): running commands, network and registry access
- [evidence.md](evidence.md): the bundled scripts and Knip
- [recipes.md](recipes.md): React 18, CRA → Vite, internal auth and HTTP packages, Router 5 → 6
- [investigations.md](investigations.md): turning warnings into decisions

## Output

[output-format.md](output-format.md).

Decisions: [decisions.md](decisions.md).
