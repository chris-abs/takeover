# PR Summary Flow

`pr-summary` is the top-level branch review skill. It checks whether the current branch appears to satisfy the ticket intent before it allows deeper technical review.

## Intent

Use `pr-summary` to answer one question before manual review starts: does this branch appear to deliver the ticket it claims to implement?

The skill does that in two stages:
- a functional gate against the linked Azure DevOps ticket
- specialist follow-up across performance, standards, and architecture when the functional verdict passes

## Result

The skill produces one merged review for the branch under review.

That audit gives the developer:
- a functional verdict against the linked ticket: `yes`, `mostly yes`, or `no`
- a short explanation of that verdict
- any important caveats or gaps that should be carried into review
- focused findings from the specialist subagents when follow-up review runs

Before any PR lookup or publish step, `pr-summary` asks whether the merged review should be published to the related Azure DevOps PR or returned in chat only.

## Artifacts

- `output/pr-summary/output.json` in the workspace root
  Local structured scratch output used to mount context for specialist subagents. Never committed.

- Azure DevOps PR description
  Preferred shared audit surface when the user opts into publishing and the merged review fits within 4000 characters.

- Azure DevOps PR comment thread
  Fallback shared audit surface when the user opts into publishing and the merged review is too long for the PR description.

## Subagent model

The specialist subagents consume the shared `output.json` scratch state plus the repo guidance mounted for their remit. They do not write their own files. `pr-summary` owns the merged review and either publishes it to Azure DevOps or returns it in chat, based on the user's choice.

## Adopting it in a repo

1. Link the skill and its agents into the repo's `.claude/` (see the root README).
2. Copy `templates/` to `.claude/pr-summary/` in the repo and fill in its architecture and standards, following `docs/repo-context.md`.
3. Make sure `output/` is ignored by git.
4. Set up Azure DevOps MCP access.

## Azure DevOps setup

The functional gate depends on Azure DevOps work-item access for the ticket inferred from the branch name.

This skill expects the Microsoft Azure DevOps MCP server to be available in the developer's local environment. It uses Azure Boards work-item lookups for ticket intent and linked PR resolution.

Typical local setup uses a repo-local `.vscode/mcp.json` entry similar to:

```json
{
  "servers": {
    "ado": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@azure-devops/mcp",
        "<organization>"
      ],
      "env": {
        "ado_mcp_project": "<project>"
      }
    }
  }
}
```

If the Azure DevOps tools are missing or cannot read work items in the configured organization and project, the skill will stop at the functional gate. The [official Azure DevOps MCP guide](https://github.com/microsoft/azure-devops-mcp/blob/main/docs/GETTINGSTARTED.md#-visual-studio-code--github-copilot) covers local setup and troubleshooting.
