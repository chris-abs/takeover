---
name: pr-summary
description: Review the current branch against its ticket intent, then coordinate focused follow-up review. Use when the user wants to know whether the branch actually delivers the functional change implied by the ticket, and then wants a single concise review that combines performance, standards, and architecture feedback.
---

## PR review intent

Use this skill as the top-level branch review workflow.

Read `docs/context.md` first, then the repo context described in `docs/repo-context.md`.

Workflow:
1. Assess whether the current branch satisfies the ticket intent.
2. If the verdict is `yes` or `mostly yes`, run specialist review in parallel.
3. Ask the user whether the merged review should be published to the PR or returned in chat only.
4. Merge the findings into one final plain-English review only after the user has answered.

Treat the functional assessment as a hard gate. If the verdict is `no`, stop unless the user explicitly asks to continue.
Before producing any final review output, you must ask the user whether to publish to the PR or return in chat only. Do not continue to final output until the user answers.

## Repo context

The repo context is required. If the workspace has no `.claude/pr-summary/repo.md`, stop and point the user to `docs/repo-context.md`.

## Ticket sourcing

Follow `docs/context.md` for ticket routing, lookup gating, and artifact expectations.

For this skill, ticket context is required when the branch contains a plausible work item number.

Use the Azure DevOps MCP Boards/work-item tool defined in `docs/context.md`. If that tool is unavailable, stop and direct the developer to the setup in `README.md`.

## Functional assessment rules

- Focus first on user-visible behaviour and ticket intent, not code quality.
- Decide whether the branch appears to satisfy the ticket in substance, not whether it is implemented elegantly.
- Use the code, the diff, and the ticket together. Do not trust branch naming alone.
- Label uncertainty clearly when the ticket context is missing or ambiguous.
- Treat `no` as a hard stop for specialist review by default.
- Treat `mostly yes` as permission to continue, but carry the important gaps forward into the final review.

Use these verdicts:
- `yes`: the branch appears to achieve the intended functional change
- `mostly yes`: the main intent is present, but there are visible gaps, caveats, or edge cases
- `no`: the implemented change does not appear to achieve the intended functional outcome

## Explanation rules

- Focus on behaviour, intent, and affected journeys.
- Use the repo vocabulary from the repo context when helpful.
- Keep mechanical edits brief: renames, imports, moved files, type plumbing, fixture churn.
- Keep any convention note narrow to placement and layering. Do not turn it into a style or quality review.
- Do not invent impact that is not supported by the diff, PR text, or ticket context.

## Artifacts

Follow `docs/context.md` for branch routing, local scratch output, and PR publishing rules.

Use one local scratch file at `output/pr-summary/output.json` in the workspace root before specialist fan-out using this shape:

```json
{
  "branch_reviewed": "feature/14029-example",
  "ticket_id": 14029,
  "ticket_title": "Keep basket edits stable while navigating back and forward",
  "delivery_mode": "unset",
  "functional_verdict": "mostly yes",
  "functional_verdict_reason": "The main URL-driven basket state change is present, but one edge case remains around stale query handling.",
  "change_summary": [
    "Short statement of the main behavioural change"
  ],
  "main_areas_touched": [
    "src/features/orders/pages/OrderDetails"
  ],
  "changed_files": [
    "src/features/orders/pages/OrderDetails/index.tsx"
  ],
  "journeys_affected": [
    "Editing an order basket"
  ],
  "meaningful_changes": [
    "Moves basket save orchestration into a feature workflow hook"
  ],
  "mechanical_changes": [
    "Renames selectors for consistency"
  ],
  "functional_gaps": [
    "Specific missing or unclear behavioural gap"
  ],
  "recommended_follow_up_agents": [
    "performance",
    "standards",
    "architecture"
  ]
}
```

Scratch file rules:
- Follow `docs/context.md` for scratch file reuse rules.
- Set `delivery_mode` to `unset` until the user explicitly chooses `publish` or `chat`.

## Specialist review workflow

Use `docs/context.md` for the gate into specialist review.

Default specialist set, defined in `agents/`:
- `pr-review-performance`
- `pr-review-standards`
- `pr-review-architecture`

Specialist rules:
- Spawn the specialists in parallel.
- Give each specialist only the scratch file path, the repo path, its remit, and the guidance files `repo.md` lists for that remit.
- Pass file paths and raw artifacts, not your own diagnosis.
- Ask each specialist to inspect the actual code, not just the structured output.
- Do not ask specialists to edit code unless the user explicitly asks for fixes.
- Do not spawn overlapping reviewers with the same remit.
- Collect findings from agent responses only. Specialists should not write their own files.

## Final user-facing output

Follow `docs/context.md` for the publish confirmation flow and final delivery rules.
Do not return the merged review in chat and do not publish it until `delivery_mode` is no longer `unset`.

Whether published or returned in chat, keep the final review concise and useful as feedback to the branch author.

Merge rules:
- Preserve every distinct material finding returned by specialists.
- De-duplicate only true overlaps across specialists. Do not collapse separate issues into one.
- Clearly separate confirmed findings from suggestions.

Suggested structure:
- Branch reviewed
- Ticket intent
- Functional verdict
- Why that verdict was reached
- Important gaps or caveats
- Performance findings
- Standards findings
- Architecture findings
- Suggested feedback to the author
