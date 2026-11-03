# Repo context

A consuming repo outlines its own architecture and standards in `.claude/pr-summary/`, copied from `templates/` beside this skill. The skill reads `.claude/pr-summary/repo.md` before anything else and stops if it is missing.

## Files

```
.claude/pr-summary/
  repo.md                       Azure DevOps details, vocabulary, specialist guidance
  architecture/overview.md      layers, boundaries, legacy containment
  architecture/layers/<layer>.md   one per layer
  standards/language.md         language and typing conventions
  standards/framework.md        framework conventions
  standards/ui.md               UI conventions
  standards/performance.md      hot paths and runtime patterns
```

`repo.md` lists which files each specialist reads. Where the repo already documents a topic, point that entry at the existing doc and delete the matching template file.

## Outlining a new repo

1. Copy `templates/` to `.claude/pr-summary/` in the repo.
2. Read the root agent docs (`CLAUDE.md`, `AGENTS.md`) and anything under `docs/`.
3. Map the source tree to its layers: where features, domain logic, data access, UI, and legacy code live, and which may import which. Write one `architecture/layers/<layer>.md` per layer.
4. Fill each file from the conventions the code actually follows, not only the ones written down.
5. Update the specialist guidance in `repo.md` to match the files that exist.
6. Have the user confirm the files before the first review.
