# Target harness

The test setup every app is moving to. It is assumed, not proposed: the benchmark measures the app against it, and the gap becomes the setup required to deliver the approved seams.

## Runner and libraries

- Vitest, with `@vitest/coverage-v8`
- `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom`, `@testing-library/user-event`
- jsdom
- MSW for HTTP

## Levels and file names

Test files sit beside the source they protect. The suffix sets the level and the Vitest project that runs it.

| Level | File suffix | Environment | Main proof |
|---|---|---|---|
| Unit | `*.unit.test.ts(x)` | node | Return value or explicit state |
| Feature integration | `*.integration.test.tsx` | jsdom | Accessible UI, URL, stored state, or recorded request |
| App integration | `*.app.integration.test.ts(x)` | jsdom | Shell rendering, access result, redirect, or recovery |

Browser E2E is out of scope for this harness. Name it as the owner where a risk needs a real browser, production build, or deployed configuration.

## Configuration

- One Vitest project per level, each with its own include pattern, environment, setup file, and timeout.
- `globals`, `mockReset`, `restoreMocks`, `unstubEnvs`, and `unstubGlobals` on.
- Source-inclusive coverage over `src/**/*.{ts,tsx}`, excluding test files, mocks, test scripts, type declarations, styles, generated code, and the entry point.
- Coverage thresholds set at the current baseline as a collapse guard, never as a target.

## Shared harness

- `src/__scripts__/`: lifecycle and integration setup files, and shared test utilities.
- `src/__mocks__/api/<domain>/handlers.ts`: MSW handlers per domain, with fixtures and builders beside them.
- The shared MSW server starts with no application handlers. Feature harnesses register only the domain handlers their routes need. Only the app harness registers the full set.

## HTTP boundary

Control HTTP at the transport with MSW. Never mock thunks, generated clients, or internal hooks when their collaboration is in scope. A controlled response proves frontend behaviour against the represented contract, not the live backend.

## Scripts

- `test`: the whole suite once
- `test:unit`, `test:integration`: one level at a time
- `test:coverage`: the suite with coverage
- `test:ci`: bail on first failure, verbose and JUnit reporters, JUnit written to `test-results/junit.xml`

## CI gate

The build pipeline runs `test:ci` before the build and publishes the JUnit results. A failing test fails the pipeline.

## Published record

Per domain under `docs/testing/<domain>/`, written once tests exist:

- `seams.md`: `Seam | Agreed contract`. No status, evidence, or test references.
- `integrations.md`: implemented integration tests, mapped to seams.
- `known-risks.md`: confirmed defects, disabled tests, and residual risks.

`docs/testing/README.md` lists the domains. Shared infrastructure risks go in `docs/testing/known-risks.md`.
