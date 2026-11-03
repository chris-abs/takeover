# Real and controlled boundaries

Decide per test scope. The same collaborator can be controlled in a focused test and real in an integration test.

**Keep real** when it owns behaviour in the test's claim, is project-owned, and runs deterministically without pulling in unrelated behaviour or live infrastructure.

**Control** when it is a remote service, provider SDK, hosted widget, nondeterministic runtime facility, or an unrelated seam.

## Claim integrity

- Every mock limits what the test proves. Mocked project-owned behaviour is not covered.
- Assert calls only when the call is itself an observable contract: request payload, navigation, analytics event, storage write. Not dispatched actions: the store layer is being migrated (see [seam-model.md](seam-model.md)).
- A mocked HTTP response proves application-to-client wiring, not backend behaviour.

## Red flags in existing tests

- Mocking the behaviour the test names.
- Mocking every project-owned child by default.
- Asserting internal helper calls when an observable outcome exists.
- Setup hidden so deeply in helpers that the coverage claim is unclear.
