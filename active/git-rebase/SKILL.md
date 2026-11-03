---
name: git-rebase
description: Safely rebase the current feature branch onto the latest remote base branch, with a recoverable backup, careful conflict handling, and explicit approval before any force-with-lease push.
---

# Git Rebase

## Safety gate

1. Inspect the branch, upstream, remotes, status, and active rebase state.
2. Stop if the worktree or index is dirty unless the user explicitly chooses how to preserve those changes.
3. Refuse to rebase the base branch itself.
4. Identify the remote default branch; do not assume `main` or `master` when Git can report it.

## Workflow

1. Create a unique local backup ref such as `backup/<branch>-before-rebase` at the current `HEAD` and report it.
2. Fetch the relevant remote.
3. Rebase the current branch directly onto `origin/<base>`; do not switch to or pull a local base branch.
4. For conflicts, inspect both sides and surrounding code. Resolve from intended behaviour; never combine both sides blindly. Stage only resolved paths and continue non-interactively where possible.
5. If intent is ambiguous, pause and ask the user.
6. Compare the result with `origin/<base>` and with the backup using a diff, log, and `git range-diff` where applicable.
7. Report commits rebased, conflicts and resolutions, validation, and the backup ref.

Never push unless the user explicitly approves it after reviewing the result. If approved, use `git push --force-with-lease`, never `--force`.

## Recovery

Use `git rebase --abort` while a rebase is active. After completion, explain the backup and ask before any destructive restore. Never run `reset --hard` or overwrite a remote branch without explicit approval.
