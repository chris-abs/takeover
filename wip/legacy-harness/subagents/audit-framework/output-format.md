# Output format

Your reply is the report, and the only thing you produce: write nothing outside the scripts' work directory. The report is the handoff for implementation, not a transcript of discovery.

## Report

### Frontmatter

```yaml
---
schema: legacy-harness/report/v2
subagent: audit-framework
app: <app folder name>
commit: <full assessed commit>
assessed_on: YYYY-MM-DD
status: complete | incomplete
status_reason: <only when incomplete: the specific reason>
headline: <one sentence: the recommended targets and how many commits get there>
proposed: <number of COMMIT-NN sections>
needs_input: <number of "Needs your input" items>
branch: <branch>
testing: assumed-precondition
---
```

`status: complete` means the plan is complete: the decisions and their order are established. It doesn't mean the upgrade is implemented or every future check has passed. An app already on target is `complete` with no commits. If agent-owned research is unfinished, continue it; never disguise it as a request for user input.

### Status

One metadata line: repository, branch and short commit, date, and **Plan complete** or **Assessment incomplete: <specific reason>**. Then exactly three short lines:

- React: current → proposed
- Dependencies: the current situation → the proposed alignment
- Build and tooling: current → proposed

No table here. Exact versions go in the commits.

### Target options

One chart per target that has more than one option, from [investigations.md](investigations.md). Leave out a target with a single option.

```md
#### Node (runs: build tooling only | build and runtime)

| Option | Supported until | Rejected by | Breaking changes that touch the app | Effort |
|---|---|---|---|---|
| <major> | YYYY-MM-DD | <packages> or none | <change: N sites> or none | version bump \| config \| code \| blocked |

Recommended: <major>. <One sentence on why; if a newer option costs one level more, name it and what it would add.>
```

Keep each cell short. The detail goes in the commit that makes the change.

### Proposed commits

The main content. One section per commit, in order:

```md
### COMMIT-NN: <type>(<scope>): <subject>

- [ ] Approve

<One or two sentences: the files and packages, with exact selected versions, and any adapter. Say why packages move together only when it changes the plan.>

After: COMMIT-NN (only when there are prerequisites)
Verify: <one concrete check of the risk this commit introduces>
```

The box is written unticked. The user ticks it to approve; an unticked commit is not implemented. Conditional commits say when to leave them out and how their successors reconnect. Keep `COMMIT-NN` IDs stable when assessing again.

Use as many small commits as the migration needs. Don't add readiness labels, repeated generic check lists or boilerplate fields.

### Needs your input

Leave the section out when it's empty. Each item says what the user needs to do, why, what the agent already tried, and which decision it blocks. Reachable research, ordinary version selection and future checks never go here.

### Checks performed

One sentence: what actually ran and its material limitation. Don't link raw evidence or cache paths.

### Optional cleanup

The last section, only when there's useful optional cleanup: unused dependencies, files or exports that the migration doesn't need removed. Give each a disposition of candidate, verified or retain, with enough detail to understand it without the raw Knip output. Cleanup the migration requires belongs in its commit instead.

## Not in the report

Apart from the target options charts: dependency tables, research narratives, compatibility matrices, blocker lists and raw tool statuses (such as `blocked`) all stay as evidence in the `workDirectory`. Put a conclusion beside the commit it affects, once. Cite repo files and official sources where useful.
