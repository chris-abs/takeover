# Dispatch

How the orchestrator starts subagents and collects their reports.

## Paths

Resolve the skill root from the folder this `SKILL.md` was loaded from, following symlinks. Pass every path to a subagent as an absolute path. Never assume an install location, username or OS temp folder.

## Starting subagents

Each subagent is a general-purpose subagent given the brief in [contract.md](contract.md). Its `AGENT.md` sets its role, guardrails and output; nothing else configures it. Don't choose a model for it; it runs on the default.

Start every audit subagent before waiting for any, so they run in parallel, then wait for all of them.

If you can't start subagents, run them one after another yourself. Before each, put aside what the previous one found: read only that subagent's folder and inputs, and don't carry findings from one to the next. Keep each report as you finish it, exactly as the subagent would have replied. Say in the handover that the audits ran in sequence.

## Replies

The reply is the report. Keep each one exactly as received; the handover reproduces it.

Wait for every subagent before writing the handover. A reply without the frontmatter in [contract.md](contract.md) counts as incomplete; record that rather than retrying silently. Retry once only for an execution failure, such as a timeout or a lost subagent.

If a subagent says it wrote a file, it broke its guardrails: say so in the handover and don't use the file.
