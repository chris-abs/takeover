# Execution

## Runtime

The scripts need Node `^20.19.0 || >=22.12.0` (`scripts/package.json`). If the current Node is older, look for a compatible runtime or version manager already on the machine. Never replace the developer's global runtime. The tool runtime is separate from the Node version proposed for the app.

## Network and registry access

Live npm calls (tool preparation, registry preflight, evidence collection, `npm pack`) need network access. They run in the app root so npm applies the developer's own project, user and environment configuration, including private-feed authentication.

- If the environment restricts network access, run these commands with whatever network-enabled execution it provides, from the first call. Use the same mode for the collector as for the preflight.
- A timeout or network failure is an execution problem, not a missing or incompatible package. Retry once with network-enabled execution before diagnosing anything else.
- Only an explicit authentication or access refusal after that retry is a reason to ask the user to sign in through their team's normal process. Name the operation that failed.
- If network access is denied, say so in the report. Never work around an approval control.

### Codex

Network access is a per-call tool permission, not a shell flag: set `sandbox_permissions: "require_escalated"` on each `exec_command` call that needs the network, with a justification. It doesn't carry over to later calls. When orchestrating through `functions.exec`, await each terminal call; don't leave unawaited calls in an isolate that ends.

### Claude Code

Commands run through the Bash tool under the session's permission mode. If a sandboxed call fails on the network, rerun it with sandboxing disabled for that call; the user approves it. Run long commands in the background and wait for them to finish rather than polling.

## Long-running commands

- `registry-preflight.mjs` limits each probe to 20 seconds. Use it before collection when network access is unknown.
- `collect-evidence.mjs` can outlast a single tool response. Run it so it keeps going, then wait for its exit code. Before using its output, check it has a completion message, a successful exit and a fresh artifact whose repo, revision and targets match.
- An empty tool response isn't evidence that a command is still running. Check before starting a duplicate. Never stop processes you didn't start.
