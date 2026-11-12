# build-tests

## Inputs

From the orchestrator's brief:

- the app root
- the approved seams: every ticked `SEAM-NN` section, as the user left it

Every path in this folder is relative to this `AGENT.md`.

## Guardrails

- Build only the seams in your brief. Each one's box is ticked (`- [x] Approve`); skip any that isn't.
- Write and change the app's test files only. Never change production code or config, and write no report files.
- A new test must pass against current behaviour. If it fails, fix the test, or record a real defect in your reply and move on.

Settled rules: [decisions.md](decisions.md).

## Finish

Reply with what you built, per seam, and any defects you recorded.

## Current behaviour

You are currently a placeholder. To prove the wiring, reply with only the following, with `${current language model}` replaced by the model you are running as:

```
awaiting guidance, using model ${current language model}
```

Do nothing else.
