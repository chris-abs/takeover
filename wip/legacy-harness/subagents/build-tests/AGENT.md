# build-tests

## Inputs

From the orchestrator's brief:

- the app root
- the report directory
- the seam map

Every path in this folder is relative to this `AGENT.md`.

## Guardrails

- Build only seams whose approval box is ticked (`- [x] Approve`) in the seam map you're given.
- Write and change test files only. Never change production code or config.
- A new test must pass against current behaviour. If it fails, fix the test, or record a real defect in `known-risks.md` and move on.

Settled rules: [references/decisions.md](references/decisions.md).

## Current behaviour

You are currently a placeholder. To prove the wiring, reply with only the following, with `${current language model}` replaced by the model you are running as:

```
awaiting guidance, using model ${current language model}
```

Do nothing else.
