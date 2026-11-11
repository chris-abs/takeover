# Output format

Written to the report directory the orchestrator gives you. Not committed. The report is the handoff for implementation, not a transcript of discovery.

## `README.md`

### Frontmatter

```yaml
schema: framework-insights/v1
assessed_on: YYYY-MM-DD
repository: <name>
branch: <branch>
commit: <full assessed commit>
assessment_status: plan-complete | assessment-incomplete
testing: assumed-precondition
```

`plan-complete` means the decisions and their order are established. It doesn't mean the upgrade is implemented or every future check has passed. An app already on target is `plan-complete` with no commits. If agent-owned research is unfinished, continue it; never disguise it as a request for user input.

### Status

One metadata line: repository, branch and short commit, date, and **Plan complete** or **Assessment incomplete: <specific reason>**. Then exactly three short lines:

- React: current → proposed
- Dependencies: the current situation → the proposed alignment
- Build and tooling: current → proposed

No table. Exact versions go in the commits.

### Proposed commits

The main content. One section per commit, in order:

```md
### COMMIT-NN: <type>(<scope>): <subject>

Status: proposed

<One or two sentences: the files and packages, with exact selected versions, and any adapter. Say why packages move together only when it changes the plan.>

After: COMMIT-NN (only when there are prerequisites)
Verify: <one concrete check of the risk this commit introduces>
```

`Status` is `proposed` when written. The user changes it to `approved` or `rejected`. Conditional commits say when to leave them out and how their successors reconnect. Keep `COMMIT-NN` IDs stable when assessing again.

Use as many small commits as the migration needs. Don't add readiness labels, repeated generic check lists or boilerplate fields.

### Needs your input

Leave the section out when it's empty. Each item says what the user needs to do, why, what the agent already tried, and which decision it blocks. Reachable research, ordinary version selection and future checks never go here.

### Checks performed

One sentence: what actually ran and its material limitation. Don't link raw evidence or cache paths.

## `cleanup.md`

Only when there's useful optional cleanup: unused dependencies, files or exports that the migration doesn't need removed. Give each a disposition of candidate, verified or retain, with enough detail to understand it without the raw Knip output. Link it from the README's checks line. Cleanup the migration requires belongs in its commit instead.

## Not in the report

Dependency tables, research narratives, compatibility matrices, blocker lists and raw tool statuses (such as `blocked`) all stay as evidence in the `workDirectory`. Put a conclusion beside the commit it affects, once. Cite repo files and official sources where useful.
