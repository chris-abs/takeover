# Harness

The orchestrator's instructions are the same on Claude Code and Codex. Only how a subagent is started differs. Subagents carry their own harness notes where they need them (for example, network access in audit-framework).

## Paths

Resolve the skill root from where this `SKILL.md` was loaded, then follow symlinks. Pass every path to a subagent as an absolute path. Never assume an install location, username or OS temp folder.

## Starting subagents

The brief is the one in [contract.md](contract.md), on both harnesses.

### Claude Code

Use the Agent tool, with `subagent_type` set to the subagent's agent name (`legacy-harness-<name>`, such as `legacy-harness-audit-tests`). The wrappers in `adapters/claude/` set each subagent's model and tools, so never pass a model override. If a wrapper isn't installed, use `general-purpose` with the same brief, and say so in the handover.

Dispatch every audit subagent in one message so they run in parallel.

### Codex

Spawn one agent per subagent with the brief as its message, all before waiting for any, then wait for all of them. Codex has no per-agent tool list or model setting, so the guardrails in each subagent's `AGENT.md` are what keep it read-only. Leave the model at the session default.

If multi-agent isn't available, run the subagents one after another in this session. Before each, put aside what the previous one found: read only that subagent's folder and inputs, and don't carry findings from one to the next.

## Replies

Wait for every subagent before writing the handover. A subagent that ends without writing `report.md` counts as incomplete; record that rather than retrying silently. Retry once only for an execution failure, such as a timeout or a lost agent.
