# Judging existing tests

For each existing test, decide:

- **Keep:** protects meaningful behaviour through a stable public scope.
- **Improve:** useful but brittle, over-mocked, weakly asserted, nondeterministic or unclear.
- **Remove:** misleading, tautological, coupled to implementation, duplicated without distinct risk, or there only for coverage.

Pay particular attention to tests coupled to code that is about to be migrated: they will break during the change without signalling a real regression. Mark them **Improve** or **Remove**.

## Quality checks

- Names behaviour, not implementation.
- Derives its expected result independently of the production code.
- Uses a public entry point and an observable outcome.
- Awaits async behaviour deterministically.
- Would survive a behaviour-preserving refactor.

If the tests are strong, say so. Don't invent findings.
