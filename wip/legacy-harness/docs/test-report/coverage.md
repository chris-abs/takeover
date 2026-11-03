# Crediting coverage

Coverage percentages point at what to investigate. They are not proof of protection.

## Credit a behaviour as protected only when

an active test exercises it through an appropriate public boundary **and** has an assertion that would detect its regression. A test file name, a passing suite, an executed line or a mocked collaborator is not evidence on its own.

## Source-inclusive coverage

Include every production file in scope so files no test imports still show up. Report lines, statements, branches and functions separately. Branch coverage often exposes missing business decisions best.

## Classify each uncovered area

- **Missing focused behaviour**
- **Missing collaboration** (integration needed)
- **Protected elsewhere:** cite the assertion and check it exercises real behaviour
- **Owned by another level:** browser, backend, provider or configuration, with the concrete reason
- **No useful behaviour:** pass-through, declarative, generated or framework-owned code
- **Dead or unreachable:** report as a source issue, not test work

## Completeness

Call a scope complete only when every material behaviour and collaboration risk is protected or defensibly classified. Otherwise it is partial, whatever the percentage. Never recommend tests that exist only to move a metric.
