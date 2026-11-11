# Handover

After the audit, the orchestrator turns the reports into a handover the user can act on. The reports are the evidence; the handover is the explanation.

## Inputs

Only the files under `reports/`. Read each `report.md` in full, and the approval file it names to list what needs review. Never re-audit the app to fill a gap; name the gap instead.

If a report is missing, or its frontmatter doesn't match [contract.md](contract.md), say so in the handover and carry on with the others.

## Files

### `handover/README.md`

The overview. In this order:

1. **Where things stand:** one short paragraph. The app, the commit assessed, which audits ran and whether each completed.
2. **What we found:** one line per audit, from its `headline`, in plain language.
3. **What to review, in order:** a numbered list. Each item names the decision, how many boxes it involves, and links to the file where the boxes are. Put first whatever blocks the most later work. Test protection comes before the changes it protects.
4. **Needs your input:** every `needs_input` item across the audits, each with what to do and what it blocks. Leave the section out when there are none.
5. **Where the audits meet:** findings two audits both reported, kept once under the audit that owns it, and any tension between their proposals (for example, a test runner one audit keeps and another replaces). Say which audit owns the decision. Leave the section out when there's none.
6. **Next step:** how to start the build phase once the review is done.

Link each audit's handover file.

### `handover/<subagent>.md`

One per audit that wrote a report. For a reader who hasn't seen the report:

1. **What this audit looked at**, in one or two sentences.
2. **What it found:** the key findings, confirmed first, then suspected, each labelled. Use the report's numbers exactly.
3. **What it proposes:** the proposals as a short list, grouped the way a reviewer would weigh them. Link each group to its boxes.
4. **What to decide:** what ticking or leaving a box means here, and anything worth knowing before deciding.
5. **What it doesn't prove:** the limits the report states.

What each audit's handover must cover:

| Subagent | Must cover |
|---|---|
| `audit-tests` | its branch (A, B or C) and why; current versus proposed seams, files and coverage; the setup that approving the seams brings with it |
| `audit-icl` | the classification; item counts by rating in each table; the main ICL gaps |
| `audit-framework` | the status; the recommended target versions and why; the proposed commits in order |

## Writing

- Plain language. Explain a term the first time you use it, or link where the report defines it.
- Short paragraphs and lists. A table only for counts.
- Never copy approval boxes into the handover. Link to them.
- Never add findings, numbers or recommendations the reports don't contain.
- The handover is generated. Running it again overwrites it, so the user's notes belong in the report files.
