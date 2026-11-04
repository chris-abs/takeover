# takeover

Workshop for our AI skills and agents. Nothing here loads on its own: a skill is used by linking it into a `.claude/` directory.

## Layout

```
active/<skill>/        finished; linked into ~/.claude
wip/<skill>/           in progress; linked into a workspace's .claude/ to try out
legacy/<skill>/        retired
```

Each skill folder holds everything it needs:

```
<skill>/
  SKILL.md             short entry point
  docs/                context the skill and its agents read
  agents/              subagent definitions, if the skill has any
```

## Linking a skill

Into a workspace, for trying out a wip skill:

```bash
ln -s ~/Projects/takeover/wip/<skill> <workspace>/.claude/skills/<skill>
```

```bash
ln -s ~/Projects/takeover/wip/<skill>/agents <workspace>/.claude/agents/<skill>
```

Into `~/.claude/` for an active skill, the same with `~/.claude/skills/` and `~/.claude/agents/`.

## Skills

- `wip/legacy-harness`: audits a legacy app so it can be safely migrated, then builds the approved test protection. Agents: `test-report`, `icl-compatibility` (ICL = InternalCL), `framework-insights`, `test-builder`.
- `active/pr-summary`: reviews the current branch against its Azure DevOps ticket, then runs specialist review. Agents: `pr-review-performance`, `pr-review-standards`, `pr-review-architecture`. Needs a repo context in the consuming repo.
