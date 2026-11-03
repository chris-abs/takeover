Shared contract for `pr-summary` and its specialist review agents.

Ticket sourcing:
- Use Azure DevOps ticket context whenever the branch contains a plausible work item number.
- Take the organization, project, and repository from the repo context.
- Use the Azure DevOps MCP Boards/work-item lookup tool to retrieve the inferred ticket id with this field projection:
  - `System.Id`
  - `System.WorkItemType`
  - `System.Title`
  - `System.State`
  - `System.CommentCount`
  - `System.Description`
  - `Microsoft.VSTS.Common.AcceptanceCriteria`
  - `System.Tags`
- Pass the projection through the tool's `fields` parameter. Do not request `expand`, relations, comments, revisions, or all fields for the initial functional assessment.
- If a projected field is absent from the response, treat it as unset. Do not repeat the lookup without a projection.
- When `System.CommentCount` is greater than zero, retrieve comments only if the description or acceptance criteria are empty, template-like, ambiguous, refer to a clarification in comments, or conflict with the branch implementation.
- Do not ask whether comments are required based on their count alone. If retrieved comments conflict with the ticket fields or leave the intended scope unclear, ask the user a specific question about which intent should govern the review.
- Do not treat a general Azure MCP server as an Azure DevOps Boards lookup tool unless it exposes a Boards/work-item operation.
- Make one real lookup attempt against the inferred ticket id.
- If no Azure DevOps Boards/work-item tool is exposed, stop and direct the user to the Azure DevOps setup in `../README.md`.
- If the single lookup attempt fails, stop and report the MCP tool failure explicitly.

Artifact routing:
- Read the current branch name first.
- Extract the first plausible work item number from the branch name when present.
- Use `output/pr-summary/output.json` in the workspace root as local scratch state for the current branch. Never stage or commit it.
- Rewrite it when the target branch changes. Otherwise, reuse and update it.
- Do not create branch-scoped or dated output directories.
- If it does not exist when a specialist needs it but the current branch is available, rebuild it from this contract, then continue.

Structured output contract:
- Write `output/pr-summary/output.json` prior to distributing subagent specialists.
- Required fields:
  - `branch_reviewed`
  - `ticket_id`
  - `ticket_title`
  - `delivery_mode`
  - `functional_verdict`
  - `functional_verdict_reason`
  - `change_summary`
  - `main_areas_touched`
  - `changed_files`
  - `journeys_affected`
  - `meaningful_changes`
  - `mechanical_changes`
  - `functional_gaps`
  - `recommended_follow_up_agents`

Distribution gate:
- Only enter specialist review after the functional assessment gate has passed.
- If `functional_verdict` is `yes` or `mostly yes`, specialist review may proceed.
- If `functional_verdict` is `no`, stop unless the user explicitly asks to continue.
- If ticket lookup was required but unavailable, do not start specialist review.

PR publish target:
- Before any PR lookup or publish step, ask the user whether they want the merged review published to the PR or returned in chat only.
- Keep `delivery_mode` set to `unset` until the user explicitly chooses `publish` or `chat`.
- If `delivery_mode` is still `unset`, stop. Do not return the merged review yet.
- If the user chooses `chat`, set `delivery_mode` to `chat`, skip linked PR lookup, and return the merged review in chat.
- If the user chooses `publish`, set `delivery_mode` to `publish`, then retrieve the same work item with relations so you can inspect linked PR artifacts.
- Keep only linked PRs for the repository named in the repo context.
- Prefer active PRs only.
- If exactly one active PR remains after repo filtering, publish to that PR.
- If zero active PRs remain after repo filtering, stop and report that no publish target was found.
- If more than one active PR remains for the repository, stop and report the ambiguity.

Final output:
- If the user opted into publishing, publish one consolidated review to the resolved PR.
- If the user opted out of publishing, return the same consolidated review in chat.
- If publishing, and the merged review is 4000 characters or fewer, write it to the PR description.
- If publishing, and the merged review exceeds 4000 characters, publish it to a PR comment thread instead.
